import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {singlePlayerData} from './dataScripts/SinglePlayerData'
import {potionData} from './dataScripts/PotionData'
import {otherCrystalCurrencies} from './dataScripts/OtherCrystalCurrencies'
import {dailyRewardData} from './dataScripts/DailyRewardData'
import {levelData} from './dataScripts/LevelData'
import {logData} from './dataScripts/LogData'
import {logRealMoneyData} from './dataScripts/LogRealMoneyData'
import {logTimeData} from './dataScripts/LogTimeData'
import {totemData} from './dataScripts/TotemData'
import {createMissionData} from './dataScripts/CreateMissionData'
import {createTrapData} from './dataScripts/CreateTrapData'
import {createItemData} from './dataScripts/CreateItemData'

export const _addNewPlayer = functions.pubsub.topic('create-new-player').onPublish(async (message) => {
    let playerName = null
    try {
        playerName = message.json.playerName
    } catch (e) {
      console.error('PubSub message was not JSON', e)
      return
    }
    const playerData = {
        AuthToken: '',
        Email: '',
        PlayerName: '',
        CurrentMoney: 0,
        TotalMoney: 0,
        CurrentLevel: 1,
        CurrentXP: 0,
        CurrentCrystals: 0,
        TotalCrystals: 0,
        CurrentLeague: '',
        CurrentGuild: '',
        CurrentKeys: 0,
        GemScore: 0,
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
        ItemData: createItemData(),
    }
    await admin.firestore().collection('Players').doc(playerName).set(playerData);
})