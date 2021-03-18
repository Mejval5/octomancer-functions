import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _getPlayerData = functions.https.onCall(async (_data) => {
    const receivedToken = _data.authToken
    const snapshot = await admin.firestore().collection('Players').where('AuthToken', '==', receivedToken).get()
    if (snapshot.empty) {
        return {message: "No matching players"}
    }
    let playerData: FirebaseFirestore.DocumentData = {}
    snapshot.forEach(doc => {
        playerData = doc.data()
        console.log(doc.id)
    })
    delete playerData.LogData
    delete playerData.LogRealMoneyData
    delete playerData.LogTimeData
    return playerData
})