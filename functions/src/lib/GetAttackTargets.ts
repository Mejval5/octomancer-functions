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
        playerData.CurrentCrystals = null
        playerData.CurrentKeys = null
        playerData.CurrentMoney = null
        playerData.CurrentLeague = null
        playerData.CurrentRankInGuild = null
        playerData.CurrentRankInLeague = null
        playerData.CurrentXP = null
        playerData.DailyRewardData = null
        playerData.DefenseLog = null
        playerData.LogData = null
        playerData.LogRealMoneyData = null
        playerData.LogTimeData = null
        playerData.MissionData = null
        playerData.OtherCrystalCurrenciesData = null
        playerData.MissionData = null
        playerData.PotionData = null
        playerData.SinglePlayerData = null
        playerData.TotalCrystals = null
        playerData.TotalMoney = null
        playerData.SinglePlayerData = null
        player_list.push(playerData)
        })
    return player_list
})