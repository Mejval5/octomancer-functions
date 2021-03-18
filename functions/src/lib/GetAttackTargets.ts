import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _getAttackTargets = functions.https.onCall(async (_data) => {
    let player_documents = await admin.firestore().collection('Players').get()
    let player_list: FirebaseFirestore.DocumentData[] = []
    player_documents.forEach(player => {
        var playerData = player.data()
        if (_data.name === playerData.PlayerName) {
            return
        }
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
})