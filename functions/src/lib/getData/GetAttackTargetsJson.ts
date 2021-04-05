import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken, GetRandomDocumentID} from '../HelperMethods/GoogleMethods'
import {GetDiceThrows, RollDice} from '../HelperMethods/GameMethods'
import {InitGem} from '../DataScripts/Gem'

const _ = require('lodash');

export const _getAttackTargetsJson = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }
    const enemies = await GetEnemies(playerData.PlayerName, _data.amount)

    const missingEnemies = _data.amount - enemies.length
    const bots = await GetBots(missingEnemies, playerData.PlayerName)
    const enemiesJson: string[] = []
    if (enemies.length > 0) {
        for (const enemy of enemies) {
            const enemyData = {name: enemy.PlayerName, attackToken: enemy.AttackToken,
                diceRolls: GetDiceThrows(), money: enemy.CurrentMoney,
                addedTime: admin.firestore.Timestamp.now(), bot: false, attacked: false,
                stars: 0, removeTask: "", gem: enemy.PickedGem}
            await admin.firestore().collection('Players').doc(playerData.PlayerName).
            collection('EnemiesAttacked').doc(enemy.PlayerName).set(enemyData)

            const enemyString = JSON.stringify(enemy).toString()
            enemiesJson.push(enemyString)
        }
    }

    if (bots.length > 0) {
        for (const bot of bots) {
            const botData = {name: bot.PlayerName, attackToken: bot.AttackToken,
                diceRolls: GetDiceThrows(), money: bot.CurrentMoney,
                addedTime: admin.firestore.Timestamp.now(), bot: true, attacked: false,
                stars: 0, removeTask: "", gem: bot.PickedGem}
            await admin.firestore().collection('Players').doc(playerData.PlayerName).
            collection('EnemiesAttacked').doc(bot.PlayerName).set(botData)

            enemiesJson.push(JSON.stringify(bot))
        }
    }
    return {success: true, message: "Enemies got: " + enemiesJson.length.toString(), enemies: enemiesJson}
})

async function GetEnemies(name: string, amount: number) : Promise<FirebaseFirestore.DocumentData[]> {
    const playerDocuments = (await admin.firestore().collection('Players').get()).docs
    let documentKeys = Object.keys(playerDocuments)
    documentKeys.sort(function() {return Math.random()-0.5})
    const previousEnemies = (await admin.firestore().collection('Players').doc(name).collection('EnemiesAttacked').get()).docs
    const playerList: FirebaseFirestore.DocumentData[] = []
    for (const documentKey in documentKeys) {
        const playerData = playerDocuments[documentKey].data()
        if (amount == playerList.length) {
            continue
        }
        if (name === playerData.PlayerName) {
            continue
        }
        if (!playerData.LevelData.ChangedLayout) {
            continue
        }
        if (HasBeenAttacked(playerData.PlayerName, previousEnemies)) {
            console.log("This one was attacked: " + playerData.PlayerName)
            continue
        }
        playerData.AttackToken = GetAttackToken(playerData.PlayerName, previousEnemies)

        if (playerData.TotemData.RitualRunning) {
            const pos = RollDice(20,22)
            for (const gemKey of Object.keys(playerData.TotemData.Gems)) {
                const gem = playerData.TotemData.Gems[gemKey]
                if (gem.Position === pos) {
                    playerData.PickedGem = gem
                    playerData.PickedGem.name = gemKey
                }
            }
        } else {
            playerData.PickedGem = {}
        }

        delete playerData.CurrentCrystals
        delete playerData.CurrentKeys
        delete playerData.CurrentLeague
        delete playerData.CurrentXP
        delete playerData.DailyRewardData
        delete playerData.DefenseLog
        delete playerData.Email
        delete playerData.LogData
        delete playerData.LogRealMoneyData
        delete playerData.LogTimeData
        delete playerData.MissionData
        delete playerData.OtherCrystalCurrenciesData
        delete playerData.MissionData
        delete playerData.PotionData
        delete playerData.SinglePlayerData
        delete playerData.TotalCrystals
        delete playerData.TotalMoney
        delete playerData.SinglePlayerData
        playerList.push(playerData)
        }
    return playerList
}

async function GetBots(amount: number, playerName: string) {
    const botDocuments = (await admin.firestore().collection('Bots').get()).docs
    const previousEnemies = await admin.firestore().collection('Players').doc(playerName).collection('EnemiesAttacked').get()
    let botList = []
    while (botList.length < amount) {
        botList.push(GetBot(botDocuments, previousEnemies))
    }
    return botList
}

function GetBot (botDocuments: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[],
    previousEnemies: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
    const bot: { [key: string]: any} = {}
    const shuffledData = _.shuffle(botDocuments)
    bot.LevelData = (shuffledData[0]).data().LevelData
    bot.CurrentMoney = Math.floor(Math.random() * 500 + 200)
    bot.TotemData = {
        RitualRunning: Math.random() > 0.7,
        RitualEnd: admin.firestore.Timestamp.fromMillis(admin.firestore.Timestamp.now().toMillis() + 1000 * 60 * 60 * 1000),
        RitualStart: admin.firestore.Timestamp.now(),
        DurabilityLeft: 3,
        BonusSlots: InitBonusSlots(),
        Gems: InitGems(),
        RitualFinishedPackage: {},
        RitualTask: ""
    }
    bot.CurrentLevel = Math.floor(Math.random() * 10 + 5)
    bot.PlayerName = GetBotName()
    bot.AttackToken = GetAttackToken(bot.PlayerName, previousEnemies.docs)
    bot.CurrentGuild = ""
    bot.GemScore = 0
    bot.ItemData = {}
    bot.TrapData = {}

    if (bot.TotemData.RitualRunning) {
        const key = _.shuffle(Object.keys(bot.TotemData.Gems))[0]
        bot.PickedGem = bot.TotemData.Gems[key]
        bot.PickedGem.Name = key
    } else {
        bot.PickedGem = {}
    }

    

    return bot
}

function GetBotName () {
    return "Steve#" + Math.floor(Math.random() * 9000 + 1000).toString()
}

function InitGems () {
    const gems: { [key: string]: any } = {}
    for (let i = 0; i < 3; i++) {
      const _t = RollDice(0,2)
      const _v = Math.round(Math.random() * 40 + 5)
      gems[GetRandomDocumentID()] = InitGem(_v, _t, i + 20)
    }
    return gems
}

function InitBonusSlots () {
    const bonusSlots: { [key: string]: any } = {}
    for (let i = 0; i < 6; i++) {
      bonusSlots[i.toString()] = false
    }
    return bonusSlots
}

function HasBeenAttacked(name: string, documents: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]) {
    let returnValue = false

    if (documents.length == 0) {
        return returnValue
    }

    for (const doc of documents) {
        if (doc.data().name === name) {
            if (doc.data().attacked) {
                returnValue = true
            }
        }
    }

    return returnValue
}

function GetAttackToken(name: string, documents: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]) {
    let returnValue = GetRandomDocumentID()

    if (documents.length == 0) {
        return returnValue
    }

    for (const doc of documents) {
        if (doc.data().name === name) {
            returnValue = doc.data().attackToken
        }
    }

    return returnValue
}

