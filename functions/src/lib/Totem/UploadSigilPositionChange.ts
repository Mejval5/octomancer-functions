import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import { playerTypeFirebase } from '../Types/PlayerTypes'
import { sigilType, totemType } from '../Types/TotemTypes'
import { totemDatasheetType } from '../Types/DatasheetTypes'
import {stopRitual} from './CancelRitual'
import * as _ from 'lodash'

export const _uploadSigilPositionChange = functions.https.onCall(async (_data) => {
    const uploadTotem = JSON.parse(_data.totem) as totemType
    const authToken = _data.authToken

    const playerDataTask = GetPlayerByAuthToken(authToken)
    const totemDatasheetTask = admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()

    const [playerData, totemDatasheetSnap] = await Promise.all([playerDataTask, totemDatasheetTask])

    const totemDatasheet = totemDatasheetSnap.data() as totemDatasheetType

    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    const areSigilsTheSame = await isMoveLegal(playerData, uploadTotem, totemDatasheet)
    if (!areSigilsTheSame) {
        return {success: false, message: "Sigils are not same"}
    }

    playerData.TotemData.NormalSlots = uploadTotem.NormalSlots
    playerData.TotemData.BonusSlots = uploadTotem.BonusSlots
    playerData.TotemData.RitualSlot = uploadTotem.RitualSlot


    await admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        TotemData: uploadTotem
          })

    return {success: true, message: "Sigils moved"}
})

async function isMoveLegal(playerData: playerTypeFirebase,
    uploadTotem: totemType, totemDatasheet: totemDatasheetType) {
    
        const playerSigilsArray = getSigilsToArray(playerData.TotemData, totemDatasheet)
        const uploadSigilsArray = getSigilsToArray(uploadTotem, totemDatasheet)

        const playerSigilsSorted = _.sortBy(playerSigilsArray, [function(sigil) { return sigil.Name; }])
        const uploadSigilsSorted = _.sortBy(uploadSigilsArray, [function(sigil) { return sigil.Name; }])
        
        if (!_.isEqual(playerSigilsSorted, uploadSigilsSorted)) {
            return false
        }

        if (!_.isEqual(playerData.TotemData.RitualSlot, uploadTotem.RitualSlot)) {
            await stopRitual(playerData)
        }
        return true
}

function getSigilsToArray(totemData: totemType, totemDatasheet: totemDatasheetType) {
    const sigilArray: sigilType[] = []
    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        const sigilSlot = totemData.NormalSlots[i]
        if (sigilSlot != null) {
            sigilArray.push(sigilSlot)
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        const sigilSlot = totemData.BonusSlots[i]
        if (sigilSlot.Unlocked && sigilSlot.Sigil != null) {
            sigilArray.push(sigilSlot.Sigil)
        }
    }

    if (totemData.RitualSlot != null) {
        sigilArray.push(totemData.RitualSlot)
    }
    return sigilArray
}