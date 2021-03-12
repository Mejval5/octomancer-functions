import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _getCurrentTime = functions.https.onCall(_ => {
    return admin.firestore.Timestamp.now().toMillis()/1000
})