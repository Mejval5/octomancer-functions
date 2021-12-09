import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import {levelType} from '../Types/LevelTypes'

export const _uploadBotLevelData = functions.https.onCall(async (_data) => {
    const levelData = JSON.parse(_data.levelData) as levelType
    const authToken = _data.authToken as string
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData == null) {
        return {success: false, message: "Player not found"}
    }
    if (playerData.PlayerName != "Octomancer") {
        return {success: false, message: "Player not admin"}
    }

    levelData.ChangedLayout = true

    await admin.firestore().collection('Bots').doc().set({
        LevelData: levelData,
        Created: admin.firestore.Timestamp.now()
          }, {merge: true})

    return {success: true, message: "Level uploaded successfully"}
})