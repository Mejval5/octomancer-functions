import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { playerTypeFirebase, playerRankType } from '../Types/PlayerTypes'

export const _getPlayerListByRank = functions.https.onCall(async () => {
    const playerDocs = await admin.firestore().collection('Players').orderBy('SigilScore', 'desc').get()
    const playerList: playerRankType[] = []
    playerDocs.forEach(player => {
        const playerRank: playerRankType = {} as playerRankType
        const playerData: playerTypeFirebase = player.data() as playerTypeFirebase
        playerRank.PlayerName = playerData.PlayerName
        playerRank.SigilScore = playerData.SigilScore
        playerList.push(playerRank)
        })
    return JSON.stringify(playerList)
})