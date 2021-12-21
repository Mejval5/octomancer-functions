import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {newSinglePlayerData} from '../DataScripts/SinglePlayerData'
import {newPotions} from '../DataScripts/PotionData'
import {newDailyRewardData} from '../DataScripts/DailyRewardData'
import {GetRandomBotDungeon} from '../DataScripts/LevelData'
import {newTotem} from '../DataScripts/TotemData'
import {createTrapData} from '../DataScripts/CreateTrapData'
import {createItemData} from '../DataScripts/CreateItemData'
import {newManaData} from '../DataScripts/ManaData'
import { playerTypeFirebase } from '../Types/PlayerTypes'
import { getPlayerSigilScore } from '../Totem/PlayerSigilScoreUpdater'
import { totemDatasheetType } from '../Types/DatasheetTypes'

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

    const totemDatasheetTask = admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()
    const levelTask = GetRandomBotDungeon()
    const totemTask = newTotem()

    const [level, totem, totemDatasheetSnap] = await Promise.all([levelTask, totemTask, totemDatasheetTask])

    const totemDatasheet = totemDatasheetSnap.data() as totemDatasheetType

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
        SigilScore: await getPlayerSigilScore(totem, totemDatasheet),
        JoinDate: admin.firestore.Timestamp.now(),
        SinglePlayerData: newSinglePlayerData,
        PotionData: newPotions(),
        DailyRewardData: newDailyRewardData,
        LevelData: level,
        TotemData: totem,
        DefenseLog: {},
        TrapData: createTrapData(),
        ItemData: createItemData()
    }
    await admin.firestore().collection('Players').doc(playerName).set(playerData);
}