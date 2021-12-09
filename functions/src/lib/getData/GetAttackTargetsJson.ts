import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken, GetRandomDocumentID} from '../HelperMethods/GoogleMethods'
import {GetSpins, RandomBotName, GetRandomInt} from '../HelperMethods/GameMethods'
import {InitSigil} from '../DataScripts/Sigil'
import {getAmountOfPortals as getAmountOfPortals, getAmountOfPortalsBot, getManaCostPerPortalFromData, getManaCostPerPortalFromDataBot} from '../GameLogic/Portaling/PortalMethods'
import { attackTargetFirebaseType, attackTargetUnityType } from '../Types/AttackTypes'
import { itemDatasheetType } from '../Types/DatasheetTypes'
import { playerTypeFirebase } from '../Types/PlayerTypes'
import { createTrapData } from '../DataScripts/CreateTrapData'

const _ = require('lodash');

export const _getAttackTargetsJson = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken

    const playerDataTask = GetPlayerByAuthToken(authToken)
    const itemDatasheetTask = admin.firestore().collection('Datasheets').doc('ItemData').get()

    const [playerData, itemDatasheetSnap] = await Promise.all([playerDataTask, itemDatasheetTask])
    const itemDatasheet: itemDatasheetType = itemDatasheetSnap.data() as itemDatasheetType

    if (playerData === null || itemDatasheet == null) {
        return {success: false, message: "Player not found"}
    }

    const enemiesTask = getEnemies(playerData.PlayerName, _data.amount, itemDatasheet)
    const botsTask = GetBots(_data.amount, itemDatasheet)


    const [enemies, bots] = await Promise.all([enemiesTask, botsTask])

    const missingEnemies = _data.amount - enemies.length

    let firestoreTasks: Promise<admin.firestore.WriteResult>[] = []

    let enemiesJson: string[] = []

    if (enemies.length > 0) {
        for (const enemy of enemies) {
            [firestoreTasks, enemiesJson] = setupSingleAttackTarget(
                enemy, firestoreTasks, playerData.PlayerName, enemiesJson)
        }
    }

    if (bots.length > 0) {
        for (let i = 0; i < missingEnemies; i++) {
            [firestoreTasks, enemiesJson] = setupSingleAttackTarget(
                bots[i], firestoreTasks, playerData.PlayerName, enemiesJson)
        }
    }

    await Promise.all(firestoreTasks)

    return {success: true, message: "Enemies got: " + enemiesJson.length.toString(), enemies: enemiesJson}
})

function setupSingleAttackTarget(enemy: attackTargetUnityType, firestoreTasks: Promise<FirebaseFirestore.WriteResult>[],
    playerName: string, enemiesJson: string[]) : [Promise<admin.firestore.WriteResult>[], string[]] {
    const enemyData: attackTargetFirebaseType = createAttackTarget(enemy, false)
    firestoreTasks.push(admin.firestore().collection('Players').doc(playerName).
        collection('EnemiesAttacked').doc(enemy.PlayerName).set(enemyData))

    enemiesJson.push(JSON.stringify(enemy))
    return [firestoreTasks, enemiesJson]
}

function createAttackTarget(target: attackTargetUnityType, isBot: boolean): attackTargetFirebaseType {
    return {
        TargetName: target.PlayerName, AttackToken: target.AttackToken,
        Spins: GetSpins(), Pearls: target.CurrentPearls, PortalCost: target.PortalCost,
        PortalsAmount: target.PortalsAmount, CorrectPortal: target.CorrectPortal,
        AddedTime: admin.firestore.Timestamp.now(), IsTargetBot: isBot, AlreadyAttacked: false,
        Stars: 0, RemoveTask: "", Sigil: target.Sigil
    }
}

async function getEnemies(name: string, amount: number, itemDatasheet: itemDatasheetType) : Promise<attackTargetUnityType[]> {
    const playerDocumentsTask =  admin.firestore().collection('Players').get()
    const previousEnemiesTask = admin.firestore().collection('Players').doc(name).collection('EnemiesAttacked').get()

    const [playerDocumentsSnap, previousAttackTargetsSnap] = await Promise.all([playerDocumentsTask, previousEnemiesTask])

    const playerDocuments = playerDocumentsSnap.docs
    const previousAttackTargets = previousAttackTargetsSnap.docs

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
        attackTarget.CurrentPearls = currentEnemyData.CurrentPearls
        attackTarget.LevelData = currentEnemyData.LevelData
        attackTarget.Sigil = currentEnemyData.TotemData.RitualSlot
        attackTarget.TrapData = currentEnemyData.TrapData
        targetList.push(attackTarget)
        }
    return targetList
}

async function GetBots(amount: number, itemDatasheet: itemDatasheetType) {
    const botDocumentsTask = admin.firestore().collection('Bots').get()
    const botDocuments = await botDocumentsTask
    let botTasks: Promise<attackTargetUnityType>[] = []
    while (botTasks.length < amount) {
        botTasks.push(GetBot(botDocuments.docs, itemDatasheet))
    }
    return await Promise.all(botTasks)
}

async function GetBot (botDocuments: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[], itemDatasheet: itemDatasheetType) {
    
    const attackTarget: attackTargetUnityType = {} as attackTargetUnityType
    const shuffledData = _.shuffle(botDocuments)
    const botData = shuffledData[0]

    attackTarget.AttackToken = GetRandomDocumentID()
    attackTarget.PortalsAmount = getAmountOfPortalsBot(itemDatasheet)
    attackTarget.CorrectPortal = GetRandomInt(1, attackTarget.PortalsAmount + 1)
    attackTarget.PortalCost = getManaCostPerPortalFromDataBot(itemDatasheet)
    attackTarget.CurrentGuild = ""
    attackTarget.CurrentPearls = Math.floor(Math.random() * 1500 + 200)
    attackTarget.PlayerName = RandomBotName()
    attackTarget.LevelData = botData.LevelData
    attackTarget.Sigil = getBotSigil()
    attackTarget.TrapData = createTrapData()

    return attackTarget
}

function getBotSigil () {
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