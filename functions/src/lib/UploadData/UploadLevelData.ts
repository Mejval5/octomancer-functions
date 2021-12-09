import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import {levelType} from '../Types/LevelTypes'

export const _uploadLevelData = functions.https.onCall(async (_data) => {
    const levelData = JSON.parse(_data.levelData) as levelType
    const authToken = _data.authToken as string
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    playerData.LevelData.TrapPositions = levelData.TrapPositions
    playerData.LevelData.EnterAndExitPositions = levelData.EnterAndExitPositions
    playerData.LevelData.ChangedLayout = true
    playerData.LevelData.Shape = levelData.Shape
    playerData.LevelData.Style = levelData.Style

    await admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        LevelData: playerData.LevelData
          })

    return {success: true, message: "Level uploaded successfully"}
})