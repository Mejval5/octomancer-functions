import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {gem} from '../DataScripts/Gem'
import {GetRandomDocumentID} from '../HelperMethods/GoogleMethods'

export const _attemptFinishingRitual = functions.https.onRequest(async (req, res) => {
    const playerName = req.body.playerName
    let playerData = (await admin.firestore().collection('Players').doc(playerName).get()).data()
    if (playerData  === undefined) {
        res.status(500).send("user not found")
    } else {
        if (admin.firestore.Timestamp.now().toMillis() > playerData.TotemData.RitualEnd.toMillis()) {

            playerData = RemoveTotemGems(playerData)
            playerData = AddNewGem(playerData)
            playerData.TotemData.RitualRunning = false
            playerData.TotemData.RitualTask = ""

            await admin.firestore().collection('Players').doc(playerName).update({
                TotemData: playerData.TotemData
                })
        }
        res.sendStatus(200)
    }
})

function RemoveTotemGems (playerData: FirebaseFirestore.DocumentData) {
    const totemSlots: { [key: string]: string} = {20: "", 21: "", 22: ""}
    Object.keys(playerData.TotemData.Gems).forEach(key => {
        const pos = String(playerData.TotemData.Gems[key].Position)
        if (pos in totemSlots) {
            delete playerData.TotemData.Gems[key]
        }
    })
    return playerData
}

function AddNewGem (playerData: FirebaseFirestore.DocumentData) {
    const newGem = Object.assign({}, gem)
    newGem.Position = 20
    newGem.Type = playerData.TotemData.RitualFinishedPackage.Type
    newGem.Value = playerData.TotemData.RitualFinishedPackage.Value
    const newGemID = GetRandomDocumentID()
    playerData.TotemData.Gems[newGemID] = newGem
    return playerData
}