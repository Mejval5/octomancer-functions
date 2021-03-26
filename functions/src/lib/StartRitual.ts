import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {StartTaskInQueue, GetPlayerByAuthToken} from './HelperMethods'

export const _startRitual = functions.https.onCall(async (_data) => {
    let playerName = ''
    const receivedToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(receivedToken)
    if (playerData === null) {
        return {message: "Player not found", success: false}
    }
    playerName = playerData.PlayerName
    if (playerData.TotemData.RitualRunning) {
        return {message: "Ritual is running", success: false}
    }
    if (!AreGemsIn(playerData)) {
        return {message: "Gems missing", success: false}
    }

    playerData.TotemData.RitualStart = admin.firestore.Timestamp.now()
    const totalGemValue = TotemGemsValue(playerData)
    const finishTime = await GetRitualTime(totalGemValue)
    playerData.TotemData.RitualEnd = finishTime
    playerData.TotemData.RitualRunning = true
    playerData.TotemData.RitualFinishedPackage = {Type: GetFinishedGemType(playerData),
        Value: await GetFinishedGemValue(totalGemValue)}

    const data = {playerName: playerName}
    const finishTask = await StartTaskInQueue("ritual-finish", "attemptFinishingRitual", data, finishTime.seconds + 1)
    playerData.TotemData.RitualTask = String(finishTask)

    await admin.firestore().collection('Players').doc(playerName).update({
        TotemData: playerData.TotemData
          })

    return {message: "Ritual started", success: true}
})

function GetFinishedGemType (playerData: FirebaseFirestore.DocumentData) {
    const totemSlots: { [key: string]: number} = {20: 0, 21: 0, 22: 0}
    Object.keys(playerData.TotemData.Gems).forEach(key => {
        const pos = String(playerData.TotemData.Gems[key].Position)
        if (pos in totemSlots) {
            totemSlots[pos] = playerData.TotemData.Gems[key].Type
        }
    })
    // get random index from 20 to 22 round(-0.49 <-> 2.49) == (0 <-> 2)
    const randomIndex = (Math.round(Math.random() * 2.98 - 0.49) + 20).toString()
    return totemSlots[randomIndex]
}

async function GetFinishedGemValue (val: number) {
    const gemRitualDatasheet = (await admin.firestore().collection("Datasheets").doc("GemRitual").get()).data()
    if (gemRitualDatasheet !== undefined) {
        return Math.round(val * gemRitualDatasheet.MultiplyPerTotemLevel[1])
    }
    return val
}

function TotemGemsValue (playerData: FirebaseFirestore.DocumentData) {
    let totalValue = 0
    const totemSlots: { [key: string]: number} = {20: 0, 21: 0, 22: 0}
    Object.keys(playerData.TotemData.Gems).forEach(key => {
        const pos = String(playerData.TotemData.Gems[key].Position)
        if (pos in totemSlots) {
            totemSlots[pos] = playerData.TotemData.Gems[key].Value
        }
    })
    totalValue = totemSlots["20"] + totemSlots["21"] + totemSlots["22"]
    return totalValue
}

function AreGemsIn (playerData: FirebaseFirestore.DocumentData) {
    let fullBool = true
    const totemSlots: { [key: string]: boolean} = {20: false, 21: false, 22: false}
    Object.keys(playerData.TotemData.Gems).forEach(key => {
        const pos = String(playerData.TotemData.Gems[key].Position)
        if (pos in totemSlots) {
            totemSlots[pos] = true
        }
    })
    fullBool = totemSlots["20"] && totemSlots["21"] && totemSlots["22"]
    return fullBool
}

async function GetRitualTime (val: number) {
    let timeRitual = 7200
    const gemRitualDatasheet = (await admin.firestore().collection("Datasheets").doc("GemRitual").get()).data()
    if (gemRitualDatasheet !== undefined) {
        for (const key in gemRitualDatasheet.TimePerValue) {
            if (parseInt(key) > val) {
                timeRitual = gemRitualDatasheet.TimePerValue[key]
                break
            }
        }
    }
    const timeNow = admin.firestore.Timestamp.now()
    const timeRitualSeconds = timeNow.seconds + timeRitual
    const timeRitualNanoseconds = timeNow.nanoseconds
    return new admin.firestore.Timestamp(timeRitualSeconds, timeRitualNanoseconds)
}