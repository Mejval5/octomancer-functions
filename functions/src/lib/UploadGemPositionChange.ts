import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from './HelperMethods'

const _ = require('lodash');

export const _uploadGemPositionChange = functions.https.onCall(async (_data) => {
    const gems = JSON.parse(_data.gems)
    const authToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    const areGemsSame = await AreGemsSame(playerData, gems)
    if (!areGemsSame) {
        return {success: false, message: "Gems are not same"}
    }

    await admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        'TotemData.Gems': gems
          })

    return {success: true, message: "Gems moved"}
})

async function AreGemsSame(playerData: any, newGems: any) {
    const oldGems = playerData.TotemData.Gems
    if (!_.isEqual(Object.keys(oldGems).sort(), Object.keys(newGems).sort())) {
        //console.log("broken keys")
        return false
    }

    let availableSlots: number[] = []
    for (let k = 0; k < 9; k++) {
        availableSlots.push(k)
    }

    for (let i = 9; i < 15; i++) {
        if (playerData.TotemData.BonusSlots[i.toString()]) {
            availableSlots.push(i)
        }
    }

    for (let j = 20; j < 23; j++) {
        availableSlots.push(j)
    }

    //console.log(availableSlots)
    for (const key in newGems) {
        const oldGem = oldGems[key]
        const newGem = newGems[key]

        if (oldGem.Value !== newGem.Value) {
            //console.log("Value wrong: " + oldGem.Value.toString() + " " + newGem.Value.toString())
            return false
        }
        if (oldGem.Type !== newGem.Type) {
            //console.log("Type wrong: " + oldGem.Type.toString() + " " + newGem.Type.toString())
            return false
        }

        if (availableSlots.includes(newGem.Position)) {
            //console.log("Removed slot: " + newGem.Position.toString())
            availableSlots = availableSlots.filter(item => item !== newGem.Position)
        } else {
            //console.log(availableSlots)
            //console.log("Slot is full: " + newGem.Position.toString())
            return false
        }

        if (playerData.TotemData.RitualRunning && [20, 21, 22].includes(oldGem.Position)) {
            if (oldGem.Position !== newGem.Position) {
                await StopRitual(playerData.PlayerName)
            }
        }
    }
    return true
}

async function StopRitual(playerName: string) {
    await admin.firestore().collection('Players').doc(playerName).update({
        'TotemData.RitualRunning': false,
        'TotemData.RitualFinishedPackage': {}
          })
}