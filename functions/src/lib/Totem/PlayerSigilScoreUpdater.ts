import * as functions from 'firebase-functions'
import { playerTypeFirebase } from '../Types/PlayerTypes'
import * as admin from 'firebase-admin'
import { totemDatasheetType } from '../Types/DatasheetTypes'
import { totemType } from '../Types/TotemTypes'

export const _playerSigilScoreUpdater = functions.firestore.document('Players/{userId}').onUpdate(async (change, _) =>{
    const playerData = change.after.data() as playerTypeFirebase

    const totemDatasheetDoc = await admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()
    const totemDatasheet = totemDatasheetDoc.data() as totemDatasheetType

    const sigilValue = await getPlayerSigilScore(playerData.TotemData, totemDatasheet)
    
    return change.after.ref.set({
        SigilScore: sigilValue
      }, {merge: true})
})

export async function getPlayerSigilScore(totemData: totemType, totemDatasheet: totemDatasheetType) {
    let sigilValue = 0
    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        const sigilSlot = totemData.NormalSlots[i]
        if (sigilSlot != null) {
            const val = sigilSlot.Value
            sigilValue += val
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        const sigilSlot = totemData.BonusSlots[i]
        if (sigilSlot.Unlocked && sigilSlot.Sigil != null) {
            const val = sigilSlot.Sigil.Value
            sigilValue += val
        }
    }

    if (totemData.RitualSlot != null) {
        const val = totemData.RitualSlot.Value
        sigilValue += val
    }
    return sigilValue
}