import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {singlePlayerData} from '../DataScripts/SinglePlayerData'
import {potionData} from '../DataScripts/PotionData'
import {otherCrystalCurrencies} from '../DataScripts/OtherCrystalCurrencies'
import {dailyRewardData} from '../DataScripts/DailyRewardData'
import {levelData} from '../DataScripts/LevelData'
import {logData} from '../DataScripts/LogData'
import {logRealMoneyData} from '../DataScripts/LogRealMoneyData'
import {logTimeData} from '../DataScripts/LogTimeData'
import {totemData} from '../DataScripts/TotemData'
import {createMissionData} from '../DataScripts/CreateMissionData'
import {createTrapData} from '../DataScripts/CreateTrapData'
import {createItemData} from '../DataScripts/CreateItemData'

export const _addNewPlayer = functions.pubsub.topic('create-new-player').onPublish(async (message) => {
    let playerName = null
    let authToken = null
    try {
        playerName = message.json.playerName
        authToken = message.json.authToken
    } catch (e) {
      console.error('PubSub message was not JSON', e)
      return
    }
    await AddNewPlayer(playerName, authToken)
})

export async function AddNewPlayer (playerName: string, authToken: string) {
    const playerData = {
        AuthToken: authToken,
        Email: '',
        PlayerName: playerName,
        CurrentMoney: 1500,
        TotalMoney: 0,
        CurrentLevel: 1,
        CurrentXP: 0,
        CurrentCrystals: 0,
        TotalCrystals: 0,
        CurrentLeague: '',
        CurrentGuild: '',
        CurrentKeys: 0,
        GemScore: 0,
        JoinDate: admin.firestore.Timestamp.now(),
        SinglePlayerData: singlePlayerData,
        PotionData: potionData,
        OtherCrystalCurrenciesData: otherCrystalCurrencies,
        DailyRewardData: dailyRewardData,
        LevelData: levelData,
        LogData: logData,
        LogRealMoneyData: logRealMoneyData,
        LogTimeData: logTimeData,
        TotemData: totemData,
        MissionData: createMissionData(),
        DefenseLog: {},
        TrapData: createTrapData(),
        ItemData: createItemData()
    }
    await admin.firestore().collection('Players').doc(playerName).set(playerData);
}