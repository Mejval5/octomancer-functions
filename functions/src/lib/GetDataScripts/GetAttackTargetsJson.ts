import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken, GetRandomDocumentID} from '../HelperMethods/GoogleMethods'
import {GetSpins, RandomBotName, GetRandomInt} from '../HelperMethods/GameMethods'
import {InitSigil} from '../CreateDataScripts/Sigil'
import {getAmountOfPortals as getAmountOfPortals, getAmountOfPortalsBot, getManaCostPerPortalFromData, getManaCostPerPortalFromDataBot} from '../GameLogic/Portaling/PortalMethods'
import { attackTargetFirebaseType, attackTargetUnityType, botDataType } from '../Types/AttackTypes'
import { attackRewardsDatasheetType, itemDatasheetType } from '../Types/DatasheetTypes'
import { playerTypeFirebase } from '../Types/PlayerTypes'
import { createTrapData } from '../CreateDataScripts/CreateTrapData'

const _ = require('lodash');

export const _getAttackTargetsJson = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken

    const playerDataTask = GetPlayerByAuthToken(authToken)
    const itemDatasheetTask = admin.firestore().collection('Datasheets').doc('ItemData').get()
    const attackRewardsTask = admin.firestore().collection('Datasheets').doc('AttackRewards').get()

    const [playerData, itemDatasheetSnap, attackRewardsSnap] = await Promise.all([playerDataTask, itemDatasheetTask, attackRewardsTask])
    const itemDatasheet: itemDatasheetType = itemDatasheetSnap.data() as itemDatasheetType
    const attackRewards = attackRewardsSnap.data() as attackRewardsDatasheetType

    if (playerData === null || itemDatasheet == null) {
        return {success: false, message: "Player not found"}
    }
    
    const previousEnemies = (await admin.firestore().collection('Players').
    doc(playerData.PlayerName).collection('EnemiesAttacked').get()).docs

    const enemiesTask = getEnemies(playerData.PlayerName, _data.amount, itemDatasheet, attackRewards, previousEnemies)
    const botsTask = GetBots(_data.amount, itemDatasheet)
    const removeOldTask = removeInvalidTargets(playerData.PlayerName, previousEnemies)


    const [enemies, bots] = await Promise.all([enemiesTask, botsTask, removeOldTask])

    const missingEnemies = _data.amount - enemies.length

    let firestoreTasks: Promise<admin.firestore.WriteResult>[] = []

    let enemiesJson: string[] = []

    if (enemies.length > 0) {
        for (const enemy of enemies) {
            [firestoreTasks, enemiesJson] = setupSingleAttackTarget(
                enemy, firestoreTasks, playerData.PlayerName, enemiesJson, false)
        }
    }

    if (bots.length > 0) {
        for (let i = 0; i < missingEnemies; i++) {
            [firestoreTasks, enemiesJson] = setupSingleAttackTarget(
                bots[i], firestoreTasks, playerData.PlayerName, enemiesJson, true)
        }
    }

    await Promise.all(firestoreTasks)

    return {success: true, message: "Enemies got: " + enemiesJson.length.toString(), enemies: enemiesJson}
})

async function removeInvalidTargets(playerName: string,
    previousAttackTargets: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[])
    : Promise<void> {

    const documentKeys = Object.keys(previousAttackTargets)
    let firestoreTasks: Promise<admin.firestore.WriteResult>[] = []

    for (const documentKey in documentKeys) {
        const enemy = previousAttackTargets[documentKey].data() as attackTargetFirebaseType
        if (enemy.AddedTime.seconds + 60 * 60 >= admin.firestore.Timestamp.now().seconds || enemy.AlreadyAttacked) {
            firestoreTasks.push(admin.firestore().collection('Players').doc(playerName).
            collection('EnemiesAttacked').doc(enemy.TargetName).delete())
        }
    }

    await Promise.all(firestoreTasks)
}

function setupSingleAttackTarget(enemy: attackTargetUnityType, firestoreTasks: Promise<FirebaseFirestore.WriteResult>[],
    playerName: string, enemiesJson: string[], isbot: boolean) : [Promise<admin.firestore.WriteResult>[], string[]] {
    const enemyData: attackTargetFirebaseType = createAttackTarget(enemy, isbot)
    firestoreTasks.push(admin.firestore().collection('Players').doc(playerName).
        collection('EnemiesAttacked').doc(enemy.PlayerName).set(enemyData))

    enemiesJson.push(JSON.stringify(enemy))
    return [firestoreTasks, enemiesJson]
}

function createAttackTarget(target: attackTargetUnityType, isBot: boolean): attackTargetFirebaseType {
    return {
        TargetName: target.PlayerName, AttackToken: target.AttackToken,
        Spins: GetSpins(), Pearls: target.Pearls, PortalCost: target.PortalCost,
        PortalsAmount: target.PortalsAmount, CorrectPortal: target.CorrectPortal,
        AddedTime: admin.firestore.Timestamp.now(), IsTargetBot: isBot, AlreadyAttacked: false,
        Stars: 0, RemoveTask: "", Sigil: target.Sigil
    }
}

async function getEnemies(name: string, amount: number, itemDatasheet: itemDatasheetType,
    attackRewards: attackRewardsDatasheetType,
    previousAttackTargets: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[])
: Promise<attackTargetUnityType[]> {
    const playerDocumentsTask =  admin.firestore().collection('Players').get()

    const playerDocumentsSnap= await playerDocumentsTask

    const playerDocuments = playerDocumentsSnap.docs

    let documentKeys = Object.keys(playerDocuments)
    documentKeys.sort(function() {return Math.random()-0.5})

    const targetList: attackTargetUnityType[] = []
    for (const documentKey in documentKeys) {
        const currentEnemyData: playerTypeFirebase = playerDocuments[documentKey].data() as playerTypeFirebase
        const attackTarget: attackTargetUnityType = {} as attackTargetUnityType
        if (amount == targetList.length) {
            break
        }
        if (name === currentEnemyData.PlayerName) {
            continue
        }
        if (!currentEnemyData.LevelData.ChangedLayout) {
            continue
        }
        if (hasBeenAttacked(currentEnemyData.PlayerName, previousAttackTargets)) {
            continue
        }
        attackTarget.AttackToken = getAttackToken(currentEnemyData.PlayerName, previousAttackTargets)
        attackTarget.PortalsAmount = getAmountOfPortals(currentEnemyData, itemDatasheet)
        attackTarget.CorrectPortal = GetRandomInt(1, attackTarget.PortalsAmount + 1)
        attackTarget.PortalCost = getManaCostPerPortalFromData(currentEnemyData, itemDatasheet)
        attackTarget.PlayerName = currentEnemyData.PlayerName
        attackTarget.CurrentGuild = currentEnemyData.CurrentGuild
        attackTarget.Pearls = Math.floor(currentEnemyData.CurrentPearls * attackRewards.BasePearlsMult)
        attackTarget.LevelData = currentEnemyData.LevelData
        attackTarget.Sigil = currentEnemyData.TotemData.RitualSlot
        attackTarget.TrapData = currentEnemyData.TrapData
        targetList.push(attackTarget)
        }
    return targetList
}

async function GetBots(amount: number, itemDatasheet: itemDatasheetType) {
    const botDocumentsTask = admin.firestore().collection('Bots').get()
    const botDocuments = (await botDocumentsTask).docs
    let botTasks: Promise<attackTargetUnityType>[] = []
    if (botDocuments.length < 1) {
        return await Promise.all(botTasks)
    }
    while (botTasks.length < amount) {
        botTasks.push(GetBot(botDocuments, itemDatasheet))
    }
    return await Promise.all(botTasks)
}

async function GetBot (botDocuments: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[], itemDatasheet: itemDatasheetType) {
    
    const attackTarget: attackTargetUnityType = {} as attackTargetUnityType
    const shuffledData = _.shuffle(botDocuments)
    const botData = shuffledData[0].data() as botDataType

    attackTarget.AttackToken = GetRandomDocumentID()
    attackTarget.PortalsAmount = getAmountOfPortalsBot(itemDatasheet)
    attackTarget.CorrectPortal = GetRandomInt(1, attackTarget.PortalsAmount + 1)
    attackTarget.PortalCost = getManaCostPerPortalFromDataBot(itemDatasheet)
    attackTarget.CurrentGuild = ""
    attackTarget.Pearls = Math.floor(Math.random() * 1500 + 200)
    attackTarget.PlayerName = RandomBotName()
    attackTarget.LevelData = botData.LevelData
    attackTarget.Sigil = getBotSigil()
    attackTarget.TrapData = createTrapData()

    return attackTarget
}

function getBotSigil () {
    if (GetRandomInt(0,3) != 1)
        return null

    const _t = GetRandomInt(0,3)
    const _v = Math.round(Math.random() * 400 + 5)
    return InitSigil(_v, _t, GetRandomDocumentID())
}

function hasBeenAttacked(name: string, documents: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]) {
    if (documents.length == 0) {
        return false
    }

    for (const doc of documents) {
        const currentEnemy: attackTargetFirebaseType = doc.data() as attackTargetFirebaseType
        if (currentEnemy.TargetName === name && currentEnemy.AlreadyAttacked) {
            return true
        }
    }

    return false
}

function getAttackToken(name: string, documents: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]) {
    if (documents.length == 0) {
        return GetRandomDocumentID()
    }

    for (const doc of documents) {
        const currentEnemy: attackTargetFirebaseType = doc.data() as attackTargetFirebaseType
        if (currentEnemy.TargetName === name) {
            return currentEnemy.AttackToken
        }
    }

    return GetRandomDocumentID()
}