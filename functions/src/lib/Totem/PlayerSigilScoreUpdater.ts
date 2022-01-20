import { playerTypeFirebase } from '../Types/PlayerTypes'
import * as admin from 'firebase-admin'
import { totemDatasheetType } from '../Types/DatasheetTypes'
import { totemType } from '../Types/TotemTypes'

export async function updatePlayerSigilScore(playerName: string){

    const playerDataTask = admin.firestore().collection('Players').doc(playerName).get()
    const totemDatasheetTask = admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()

    const [playerDataSnap, totemDatasheetSnap] = await Promise.all([playerDataTask, totemDatasheetTask])

    const playerData = playerDataSnap.data() as playerTypeFirebase
    const totemDatasheet = totemDatasheetSnap.data() as totemDatasheetType

    const sigilValue = getPlayerSigilScore(playerData.TotemData, totemDatasheet)
    
    await admin.firestore().collection('Players').doc(playerName).update({
        SigilScore: sigilValue
    })
}

export function getPlayerSigilScore(totemData: totemType, totemDatasheet: totemDatasheetType) {
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

    if (totemData.FinishedRituals != null) {
        for (let i = 0; i < Object.keys(totemData.FinishedRituals).length; i++) {
            const sigil = totemData.FinishedRituals[i]
            if (sigil != null) {
                const val = sigil.Value
                sigilValue += val
            }
        }
    }

    if (totemData.RitualSlot != null) {
        const val = totemData.RitualSlot.Value
        sigilValue += val
    }
    return sigilValue
}