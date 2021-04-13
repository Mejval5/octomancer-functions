import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _getPlayerListByRank = functions.https.onCall(async () => {
    const playerDocs = await admin.firestore().collection('Players').orderBy('GemScore', 'desc').get()
    const playerList: any[] = []
    playerDocs.forEach(player => {
        const _p: {[key: string]: any} = {}
        _p.PlayerName = player.data().PlayerName
        _p.GemScore = player.data().GemScore
        playerList.push(_p)
        })
    return JSON.stringify(playerList)
})