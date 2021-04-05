import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'

export const _cancelRitual = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }
    await StopRitual(playerData.PlayerName)
    return {success: true, message: "Ritual stopped"}
})

async function StopRitual(playerName: string) {
    await admin.firestore().collection('Players').doc(playerName).update({
        'TotemData.RitualRunning': false,
        'TotemData.RitualFinishedPackage': {}
          })
}