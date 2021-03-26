import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _getPlayerListByRank = functions.https.onCall(async () => {
    const player_documents = await admin.firestore().collection('Players').orderBy('GemScore', 'desc').get()
    const player_list: string[] = []
    player_documents.forEach(player => {
        player_list.push(player.id)
        })
    return player_list
})