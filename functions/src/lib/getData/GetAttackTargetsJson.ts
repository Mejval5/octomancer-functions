import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken, GetRandomDocumentID, GetDiceThrows} from '../HelperMethods'

export const _getAttackTargetsJson = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }
    let enemies = await GetEnemies(playerData.PlayerName)

    const missingEnemies = enemies.length - _data.amount
    let bots = await GetBots(missingEnemies)

    
    const enemiesJson: string[] = []
    if (enemies.length > 0) {
        enemies.forEach(async (enemy) => {
            const enemyData = {name: enemy.PlayerName, token: enemy.AttackToken, diceRolls: GetDiceThrows(),
                addedTime: admin.firestore.Timestamp.now(), bot: false, attacked: false, stars: 0}
            await admin.firestore().collection('Players').doc(playerData.PlayerName).
            collection('EnemiesAttacked').doc(enemy.PlayerName).set(enemyData)

            enemiesJson.push(JSON.stringify(enemy))
        })
    }

    if (bots.length > 0) {
        bots.forEach(async (bot) => {
            const botData = {name: bot.PlayerName, token: bot.AttackToken, diceRolls: GetDiceThrows(),
                addedTime: admin.firestore.Timestamp.now(), bot: true, attacked: false, stars: 0}
            await admin.firestore().collection('Players').doc(playerData.PlayerName).
            collection('EnemiesAttacked').doc(bot.PlayerName).set(botData)

            enemiesJson.push(JSON.stringify(bot))
        })
    }
    return {success: true, message: "Enemies got", enemies: enemiesJson}
})

async function GetEnemies(name: string) {
    const player_documents = await admin.firestore().collection('Players').get()
    const previousEnemies = await admin.firestore().collection('Players').doc(name).collection('EnemiesAttacked').get()
    const player_list: FirebaseFirestore.DocumentData[] = []
    player_documents.forEach(player => {
        const playerData = player.data()
        if (name === playerData.PlayerName) {
            return
        }
        if (!playerData.LevelData.ChangedLayout) {
            return
        }
        if (HasBeenAttacked(playerData.PlayerName, previousEnemies)) {
            return
        }
        playerData.AttackToken = GetRandomDocumentID()
        playerData.IsBot = false

        delete playerData.CurrentCrystals
        delete playerData.CurrentKeys
        delete playerData.CurrentMoney
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
        player_list.push(playerData)
        })
    return player_list
}

async function GetBots(amount: number) {
    //const bot_documents = await admin.firestore().collection('Bots').get()
    const bot_list: FirebaseFirestore.DocumentData[] = []
    return bot_list
}


function HasBeenAttacked(name: string, snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
    let returnValue = false

    if (snapshot.empty) {
        return returnValue
    }

    snapshot.forEach((doc) => {
        if (doc.data().name === name) {
            if (doc.data().attacked) {
                returnValue = true
            }
        }
    })
    return returnValue
}

