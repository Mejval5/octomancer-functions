import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import { totemDatasheetType } from '../Types/DatasheetTypes'
import { nullableSigilType} from '../Types/TotemTypes'
import { playerTypeFirebase } from '../Types/PlayerTypes'

export const _mergeSigils = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken as string
    const playerDataTask = GetPlayerByAuthToken(authToken)
    const totemDatasheetTask = admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()

    const [playerData, totemDatasheetSnap] = await Promise.all([playerDataTask, totemDatasheetTask])

    const totemDatasheet = totemDatasheetSnap.data() as totemDatasheetType

    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    const mergeFrom = _data.mergeFrom as string
    const mergeTo = _data.mergeTo as string

    if (mergeTo == mergeFrom) {
        return {success: false, message: "Sigils are same"}
    }


    const fromSigil: nullableSigilType = getSigilByName(mergeFrom, playerData, totemDatasheet)
    const toSigil: nullableSigilType = getSigilByName(mergeTo, playerData, totemDatasheet)
    
    if (fromSigil == null || toSigil == null)
        return {success: false, message: "No sigils at location"}

    if (fromSigil.Type != toSigil.Type)
        return {success: false, message: "Different types"}

    const newSigil = toSigil
    newSigil.Value += fromSigil.Value

    playerData.TotemData = setSigilByName(mergeFrom, totemDatasheet, playerData, null)
    playerData.TotemData = setSigilByName(mergeTo, totemDatasheet, playerData, newSigil)

    await admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        TotemData: playerData.TotemData
          })

    return {success: true, message: "SigilsMerged"}
})

function getSigilByName(sigilName: string, playerData: playerTypeFirebase,
     totemDatasheet: totemDatasheetType): nullableSigilType {

    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        const sigilSlot = playerData.TotemData.NormalSlots[i]
        if (sigilSlot != null && sigilName == sigilSlot.Name) {
            return sigilSlot
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        const sigilSlot = playerData.TotemData.BonusSlots[i]
        if (sigilSlot != null && sigilSlot.Unlocked) {
            if (sigilSlot.Sigil != null && sigilName == sigilSlot.Sigil.Name) {
                return sigilSlot.Sigil
            }
        }
    }

    const ritualSigil = playerData.TotemData.RitualSlot
    if (ritualSigil != null && sigilName == ritualSigil.Name) {
        return ritualSigil
    }

    return null
}

function setSigilByName(sigilName: string, totemDatasheet: totemDatasheetType,
    playerData: playerTypeFirebase, sigil: nullableSigilType) {

    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        const sigilSlot = playerData.TotemData.NormalSlots[i]
        if (sigilSlot != null && sigilName == sigilSlot.Name) {
            playerData.TotemData.NormalSlots[i] = sigil
            return playerData.TotemData
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        const sigilSlot = playerData.TotemData.BonusSlots[i]
        if (sigilSlot != null && sigilSlot.Unlocked) {
            if (sigilSlot.Sigil != null && sigilName == sigilSlot.Sigil.Name) {
                playerData.TotemData.BonusSlots[i].Sigil = sigil
                return playerData.TotemData
            }
        }
    }

    const ritualSigil = playerData.TotemData.RitualSlot
    if (ritualSigil != null && sigilName == ritualSigil.Name) {
        playerData.TotemData.RitualSlot = sigil
        return playerData.TotemData
    }

    return playerData.TotemData
}
