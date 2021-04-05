import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'

export const _uploadBotLevelData = functions.https.onCall(async (_data) => {
    const levelData = JSON.parse(_data.levelData)
    const playerData = await GetPlayerByAuthToken("wat")
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    playerData.LevelData.TrapPositions = levelData.TrapPositions
    playerData.LevelData.EnterAndExitPositions = levelData.EnterAndExitPositions
    playerData.LevelData.ChangedLayout = true

    await admin.firestore().collection('Bots').doc().set({
        LevelData: playerData.LevelData
          }, {merge: true})

    return {success: true, message: "Level uploaded successfully"}
})