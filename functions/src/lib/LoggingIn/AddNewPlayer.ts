import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {newSinglePlayerData} from '../DataScripts/SinglePlayerData'
import {newPotions} from '../DataScripts/PotionData'
import {newDailyRewardData} from '../DataScripts/DailyRewardData'
import {newLevelData} from '../DataScripts/LevelData'
import {newTotem} from '../DataScripts/TotemData'
import {createTrapData} from '../DataScripts/CreateTrapData'
import {createItemData} from '../DataScripts/CreateItemData'
import {newManaData} from '../DataScripts/ManaData'
import { playerTypeFirebase } from '../Types/PlayerTypes'

export const _addNewPlayer = functions.pubsub.topic('create-new-player').onPublish(async (message) => {
    let playerName: string = ""
    let authToken: string = ""
    try {
        playerName = message.json.playerName as string
        authToken = message.json.authToken as string
    } catch (e) {
      console.error('PubSub message was not JSON', e)
      return
    }

    if (playerName == "" || authToken == "") {
        return
    }

    await AddNewPlayer(playerName, authToken)
})

export async function AddNewPlayer (playerName: string, authToken: string) {

    //const levelTask = GetRandomBotDungeon()
    const totemTask = newTotem()

    const [totem] = await Promise.all([totemTask])

    const playerData: playerTypeFirebase = {
        AuthToken: authToken,
        Email: '',
        PlayerName: playerName,
        CurrentPearls: 1500,
        TotalPearls: 1500,
        CurrentLevel: 1,
        CurrentXP: 0,
        CurrentGems: 0,
        TotalGems: 0,
        CurrentLeague: '',
        CurrentGuild: '',
        ManaData: newManaData,
        SigilScore: 0,
        JoinDate: admin.firestore.Timestamp.now(),
        SinglePlayerData: newSinglePlayerData,
        PotionData: newPotions(),
        DailyRewardData: newDailyRewardData,
        LevelData: newLevelData,
        TotemData: totem,
        DefenseLog: {},
        TrapData: createTrapData(),
        ItemData: createItemData()
    }
    await admin.firestore().collection('Players').doc(playerName).set(playerData);
}