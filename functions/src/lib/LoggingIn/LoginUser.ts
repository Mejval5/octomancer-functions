import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _loginUser = functions.https.onCall(async (_data) => {
    const tokenID = _data.tokenID
    let success = true
    let returnName = ''
    let message = ''

    const snapshot = await admin.firestore().collection('Players').where('AuthToken', '==', tokenID).get()

    if (snapshot.empty) {
        success = false
        message = 'user not in database'
    } else {
        snapshot.forEach(doc => {
            returnName = doc.id
            message = 'user found: ' + returnName
        });
    }

    return {success: success, userName: returnName, message: message}
})