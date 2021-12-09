import * as functions from 'firebase-functions'
import { playerTypeFirebase } from '../Types/PlayerTypes'
import * as admin from 'firebase-admin'
import { totemDatasheetType } from '../Types/DatasheetTypes'

export const _playerSigilScoreUpdater = functions.firestore.document('Players/{userId}').onUpdate(async (change, _) =>{
    const playerData = change.after.data() as playerTypeFirebase
    let sigilvalue = 0

    const totemDatasheetDoc = await admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()
    const totemDatasheet = totemDatasheetDoc.data() as totemDatasheetType

    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        const sigilSlot = playerData.TotemData.NormalSlots[i]
        if (sigilSlot != null) {
            const val = sigilSlot.Value
            sigilvalue += val
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        const sigilSlot = playerData.TotemData.BonusSlots[i]
        if (sigilSlot.Unlocked && sigilSlot.Sigil != null) {
            const val = sigilSlot.Sigil.Value
            sigilvalue += val
        }
    }

    if (playerData.TotemData.RitualSlot != null) {
        const val = playerData.TotemData.RitualSlot.Value
        sigilvalue += val
    }
    
    return change.after.ref.set({
        SigilScore: sigilvalue
      }, {merge: true})
})