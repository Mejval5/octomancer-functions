import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetRandomDocumentID} from '../HelperMethods/GoogleMethods'
import { sigilType } from '../Types/TotemTypes'
import { playerTypeFirebase } from '../Types/PlayerTypes'
import { conversionsDatasheetType, totemDatasheetType } from '../Types/DatasheetTypes'
import { updatePlayerSigilScore } from './PlayerSigilScoreUpdater'

export const _addNewSigilToTotem = functions.pubsub.topic('add-new-sigil').onPublish(async (message) => {
    let playerName = ""
    let sigilName = ""
    let _sigilType = -1
    let sigilValue = -1

    try {
        playerName = message.json.playerName as string
        sigilName = message.json.sigilName as string
        _sigilType = parseInt(message.json.sigilType)
        sigilValue = parseInt(message.json.sigilValue)
    } catch (e) {
      console.error('PubSub message was not JSON', e)
      return
    }

    if (_sigilType === -1 || sigilValue === -1 || playerName === "") {
        return
    }
    
    if (sigilName === "") {
        sigilName = GetRandomDocumentID()
    }

    await addSigilToPlayer(playerName, sigilName, _sigilType, sigilValue)
})

export async function addSigilToPlayer(playerName: string, sigilName: string, _sigilType: number, sigilValue: number) {
    const newSigil: sigilType = {Type: _sigilType, Value: sigilValue, Name: sigilName}

    const playerRef = admin.firestore().collection('Players').doc(playerName)

    const playerDataTask = playerRef.get()
    const totemDatasheetTask = admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()
    const conversionsDatasheetTask = await admin.firestore().collection('Datasheets').doc("Conversions").get()
    const [playerDataDoc, totemDatasheetDoc, conversionsDatasheetDoc] = await Promise.all([playerDataTask, totemDatasheetTask, conversionsDatasheetTask])

    const playerData = playerDataDoc.data() as playerTypeFirebase
    const totemDatasheet = totemDatasheetDoc.data() as totemDatasheetType
    const conversionsDatasheet = conversionsDatasheetDoc.data() as conversionsDatasheetType

    if (playerData == null) { 
        console.error('Player does not exist')
        return
    }

    const wasSigilAdded = await tryFillFirstAvailableSlot(playerRef, playerData, totemDatasheet, newSigil)
    if (wasSigilAdded) {
        await updatePlayerSigilScore(playerData.PlayerName)
        return
    }

    const lowestSigilInInventory = findLowestSigil(playerData, totemDatasheet)

    if (lowestSigilInInventory >= newSigil.Value) {
        await sellSigil(newSigil.Value, playerRef, conversionsDatasheet)
        return
    }

    await replaceLowestSigil(
        playerData, totemDatasheet, playerRef, conversionsDatasheet, lowestSigilInInventory, newSigil)

    await updatePlayerSigilScore(playerData.PlayerName)

}

async function sellSigil(sigilValueToSell: number,
    playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
    conversionsDatasheet: conversionsDatasheetType) {
    const pearlsToReceive = sigilValueToSell * conversionsDatasheet.SigilValueToPearls
    await playerRef.update({
        CurrentPearls: admin.firestore.FieldValue.increment(pearlsToReceive)
    })
}

async function replaceLowestSigil(playerData: playerTypeFirebase, totemDatasheet: totemDatasheetType,
    playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, 
    conversionsDatasheet: conversionsDatasheetType, lowestSigilInInventory: number, newSigil: sigilType) {

    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        const sigilSlot = playerData.TotemData.NormalSlots[i]
        if (sigilSlot != null) {
            const sigilvalue = sigilSlot.Value
            if (sigilvalue <= lowestSigilInInventory) {
                playerData.TotemData.NormalSlots[i] = newSigil
                return await updatePlayerAndSellValue(playerRef, playerData, sigilvalue, conversionsDatasheet)
            }
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        const sigilSlot = playerData.TotemData.BonusSlots[i]
        if (sigilSlot.Unlocked && sigilSlot.Sigil != null) {
            const sigilvalue = sigilSlot.Sigil.Value
            if (sigilvalue <= lowestSigilInInventory) {
                sigilSlot.Sigil = newSigil
                return await updatePlayerAndSellValue(playerRef, playerData, sigilvalue, conversionsDatasheet)
            }
        }
    }

    if (playerData.TotemData.RitualSlot != null && !playerData.TotemData.RitualRunning) {
        const sigilvalue = playerData.TotemData.RitualSlot.Value
        if (sigilvalue <= lowestSigilInInventory) {
            playerData.TotemData.RitualSlot = newSigil
            return await updatePlayerAndSellValue(playerRef, playerData, sigilvalue, conversionsDatasheet)
        }
    }
}

export async function updatePlayerAndSellValue(playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, playerData: playerTypeFirebase, sigilValue: number, conversionsDatasheet: conversionsDatasheetType) {
    const updateTask = playerRef.update({ TotemData: playerData.TotemData })
    const sellTask = sellSigil(sigilValue, playerRef, conversionsDatasheet)
    await Promise.all([updateTask, sellTask])
}

function findLowestSigil(playerData: playerTypeFirebase, totemDatasheet: totemDatasheetType) {
    let lowestSigilValue = Infinity

    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        const sigilSlot = playerData.TotemData.NormalSlots[i]
        if (sigilSlot != null) {
            const val = sigilSlot.Value
            if (val < lowestSigilValue) {
                lowestSigilValue = val
            }
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        const sigilSlot = playerData.TotemData.BonusSlots[i]
        if (sigilSlot.Unlocked && sigilSlot.Sigil != null) {
            const val = sigilSlot.Sigil.Value
            if (val < lowestSigilValue) {
                lowestSigilValue = val
            }
        }
    }

    if (playerData.TotemData.RitualSlot != null && !playerData.TotemData.RitualRunning) {
        const val = playerData.TotemData.RitualSlot.Value
        if (val < lowestSigilValue) {
            lowestSigilValue = val
        }
    }

    return lowestSigilValue
}

async function tryFillFirstAvailableSlot (playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
    playerData: playerTypeFirebase, totemDatasheet: totemDatasheetType, newSigil: sigilType) {
    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        if (playerData.TotemData.NormalSlots[i] == null) {
            playerData.TotemData.NormalSlots[i] = newSigil
            await playerRef.update({ TotemData: playerData.TotemData })
            return true
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        if (playerData.TotemData.BonusSlots[i].Unlocked && playerData.TotemData.BonusSlots[i].Sigil == null) {
            playerData.TotemData.BonusSlots[i].Sigil = newSigil
            await playerRef.update({ TotemData: playerData.TotemData })
            return true
        }
    }

    if (playerData.TotemData.RitualSlot == null) {
        playerData.TotemData.RitualSlot = newSigil
        await playerRef.update({ TotemData: playerData.TotemData })
        return true
    }

    return false
}