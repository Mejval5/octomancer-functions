import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import {playerTypeFirebase} from '../Types/PlayerTypes'

export const _cancelRitual = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken as string
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData == null) {
        return {success: false, message: "Player not found"}
    }
    await stopRitual(playerData)
    return {success: true, message: "Ritual stopped"}
})

export async function stopRitual(playerData: playerTypeFirebase) {
    playerData.TotemData.RitualRunning = false
    playerData.TotemData.RitualFinishedPackage = null

    await admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        TotemData: playerData.TotemData
          })
}