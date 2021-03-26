import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _getAttackTargetsJson = functions.https.onCall(async (_data) => {
    const player_documents = await admin.firestore().collection('Players').get()
    const player_list: string[] = []
    player_documents.forEach(player => {
        const playerData = player.data()
        if (_data.name === playerData.PlayerName) {
            return
        }
        if (!playerData.LevelData.ChangedLayout) {
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
        player_list.push(JSON.stringify(playerData))
        })
    return player_list
})