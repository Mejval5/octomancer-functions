import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _getDatasheets = functions.https.onCall(async () => {
    const snapshot = await admin.firestore().collection('Datasheets').get()
    if (snapshot.empty) {
        return {message: "Can't get datasheets", success: false}
    }
    const datasheets: { [key: string]: any } = {}
    snapshot.forEach(doc => {
        datasheets[doc.id] = doc.data()
    })
    const returnData = {message: "Received datasheets: " + Object.keys(datasheets).length,
    success: true, datasheets: JSON.stringify(datasheets)}
    return returnData
})