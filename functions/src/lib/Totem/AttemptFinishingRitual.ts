import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {playerTypeFirebase} from '../Types/PlayerTypes'
import { sigilSlotsType } from '../Types/TotemTypes'
import { updatePlayerSigilScore } from './PlayerSigilScoreUpdater'

export const _attemptFinishingRitual = functions.https.onRequest(async (req, res) => {
    const playerName = req.body.playerName as string
    let playerData = (await admin.firestore().collection('Players').doc(playerName).get()).data() as playerTypeFirebase
    if (playerData  == null) {
        console.log("user not found")
        res.status(500).send("user not found")
        return
    }
    if (admin.firestore.Timestamp.now().toMillis() < playerData.TotemData.RitualEnd.toMillis() - 500) {
        console.log("too soon")
        res.status(500).send("too soon")
        return
    }
    if (playerData.TotemData.RitualFinishedPackage == null) {
        console.log("no ritual package")
        res.status(500).send("no ritual package")
        return
    }

    let newKey = 0
    if (playerData.TotemData.FinishedRituals == null)
        playerData.TotemData.FinishedRituals = {} as sigilSlotsType
    else
        newKey = Object.keys(playerData.TotemData.FinishedRituals).length
    
    playerData.TotemData.FinishedRituals[newKey] = playerData.TotemData.RitualFinishedPackage

    playerData.TotemData.RitualRunning = false
    playerData.TotemData.RitualFinishedPackage = null
    playerData.TotemData.RitualSlot = null
    playerData.TotemData.RitualTask = ""

    await admin.firestore().collection('Players').doc(playerName).update({
        TotemData: playerData.TotemData
        })
    
    await updatePlayerSigilScore(playerName)

    res.sendStatus(200)
})