import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetRandomDocumentID} from '../HelperMethods/GoogleMethods'
import {playerTypeFirebase} from '../Types/PlayerTypes'
import {sigilType} from '../Types/TotemTypes'

export const _attemptFinishingRitual = functions.https.onRequest(async (req, res) => {
    const playerName = req.body.playerName as string
    let playerData = (await admin.firestore().collection('Players').doc(playerName).get()).data() as playerTypeFirebase
    if (playerData  == null) {
        res.status(500).send("user not found")
        return
    }
    if (admin.firestore.Timestamp.now().toMillis() < playerData.TotemData.RitualEnd.toMillis() - 500) {
        return
    }
    if (playerData.TotemData.RitualFinishedPackage == null) {
        return
    }

    playerData.TotemData.RitualRunning = false
    playerData.TotemData.RitualTask = ""
    playerData.TotemData.RitualSlot = getNewSigil(playerData.TotemData.RitualFinishedPackage)

    await admin.firestore().collection('Players').doc(playerName).update({
        TotemData: playerData.TotemData
        })
        
    res.sendStatus(200)
})

function getNewSigil (inputSigil: sigilType) {
    const newSigil: sigilType = {
        Name: GetRandomDocumentID(),
        Type: inputSigil.Type,
        Value: inputSigil.Value
    }
    return newSigil
}