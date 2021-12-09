import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {UpdatePlayerAll} from '../DataScripts/UpdateScripts/PlayerUpdater'
import { playerTypeFirebase, playerTypeUnity } from '../Types/PlayerTypes'

export const _getPlayerDataJson = functions.https.onCall(async (_data) => {
    const receivedToken = _data.authToken
    const snapshot = await admin.firestore().collection('Players').where('AuthToken', '==', receivedToken).get()
    if (snapshot.empty) {
        return {message: "No matching players"}
    }
    let playerData: playerTypeFirebase = {} as playerTypeFirebase
    let playerName: string = ""
    snapshot.forEach(doc => {
        playerData = doc.data() as playerTypeFirebase
        playerName = doc.id
    })

    await UpdatePlayerAll(playerName)

    const returnPlayer: playerTypeUnity = playerData as playerTypeUnity
    
    return JSON.stringify(returnPlayer)
})