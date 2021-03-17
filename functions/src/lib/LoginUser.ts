import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _loginUser = functions.https.onCall(async (_data) => {
    let tokenID = _data.tokenID
    let success = true
    let returnName = ''
    let returnMessage = ''

    let snapshot = await admin.firestore().collection('Players').where('AuthToken', '==', tokenID).get();

    if (snapshot.empty) {
        success = false
        returnMessage = 'user not in database'
    } else {
        snapshot.forEach(doc => {
            returnName = doc.id
            returnMessage = 'user found: ' + returnName
        });
    }

    return {success: success, userName: returnName, returnMessage: returnMessage}
})