import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {StartTaskInQueue, GetPlayerByAuthTokenWithRef, GetRandomDocumentID} from '../HelperMethods/GoogleMethods'
import { totemDatasheetType } from '../Types/DatasheetTypes'
import { sigilType } from '../Types/TotemTypes'

export const _startRitual = functions.https.onCall(async (_data) => {
    const receivedToken = _data.authToken as string
    const [playerData, playerRef] = await GetPlayerByAuthTokenWithRef(receivedToken)
    if (playerData == null || playerRef == null) {
        return {message: "Player not found", success: false}
    }
    if (playerData.TotemData.RitualRunning) {
        return {message: "Ritual is running", success: false}
    }
    if (playerData.TotemData.RitualSlot == null) {
        return {message: "Sigil is missing", success: false}
    }
    
    const totemDatasheetSnap = await admin.firestore().collection("Datasheets").doc("SigilRitual").get()
    const totemDatasheet = totemDatasheetSnap.data() as totemDatasheetType

    playerData.TotemData.RitualRunning = true
    playerData.TotemData.RitualStart = admin.firestore.Timestamp.now()

    const finishTime = getRitualFinishTime(playerData.TotemData.RitualSlot.Value, totemDatasheet)

    playerData.TotemData.RitualEnd = finishTime

    const finishedSigil = {} as sigilType
    finishedSigil.Type = playerData.TotemData.RitualSlot.Type
    finishedSigil.Value = getFinishedSigilValue(playerData.TotemData.RitualSlot.Value, totemDatasheet)
    finishedSigil.Name = GetRandomDocumentID()

    const data = {playerName: playerData.PlayerName}
    const finishTask = await StartTaskInQueue("ritual-finish", "attemptFinishingRitual", data, finishTime.seconds)
    playerData.TotemData.RitualTask = String(finishTask)

    await playerRef.update({
        TotemData: playerData.TotemData
          })

    return {message: "Ritual started", success: true}
})

function getFinishedSigilValue (val: number, totemDatasheet: totemDatasheetType) {
    return Math.round(val * totemDatasheet.TotemSigilMultiply)
}

function getRitualFinishTime (val: number, totemDatasheet: totemDatasheetType) {
    let timeRitual = 30
    for (const key in totemDatasheet.RitualLengthPerSigilValue) {
        if (parseInt(key) > val) {
            timeRitual = totemDatasheet.RitualLengthPerSigilValue[key]
            break
    }
    }
    const timeNow = admin.firestore.Timestamp.now()
    const timeRitualSeconds = timeNow.seconds + timeRitual
    const timeRitualNanoseconds = timeNow.nanoseconds
    return new admin.firestore.Timestamp(timeRitualSeconds, timeRitualNanoseconds)
}