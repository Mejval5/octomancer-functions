import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthTokenWithRef} from '../HelperMethods/GoogleMethods'
import { conversionsDatasheetType, totemDatasheetType } from '../Types/DatasheetTypes'
import { playerTypeFirebase } from '../Types/PlayerTypes'
import { updatePlayerAndSellValue } from './AddNewSigilToTotem'

export const _sellSigil = functions.https.onCall(async (_data) => {
    const sigilName = _data.sigilName as string
    const authToken = _data.authToken as string
    const [playerData, playerRef] = await GetPlayerByAuthTokenWithRef(authToken)

    if (playerData == null || playerRef == null) {
        return {success: false, message: "Player not found"}
    }

    const totemDatasheetTask = admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()
    const conversionsDatasheetTask = await admin.firestore().collection('Datasheets').doc("Conversions").get()
    const [totemDatasheetDoc, conversionsDatasheetDoc] = await Promise.all([totemDatasheetTask, conversionsDatasheetTask])

    const totemDatasheet = totemDatasheetDoc.data() as totemDatasheetType
    const conversionsDatasheet = conversionsDatasheetDoc.data() as conversionsDatasheetType

    const sellValue = await sellSigil(playerData, totemDatasheet, playerRef, conversionsDatasheet, sigilName)

    if (sellValue == -1) {
        return {success: false, message: "Sigil not found"}
    }

    return {success: true, message: "Sigil sond for :" + sellValue.toString()}
})

async function sellSigil(playerData: playerTypeFirebase, totemDatasheet: totemDatasheetType,
    playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, 
    conversionsDatasheet: conversionsDatasheetType, sellSigilName: string) {

    for (let i = 0; i < totemDatasheet.RegularSlots; i++) {
        const sigilSlot = playerData.TotemData.NormalSlots[i]
        if (sigilSlot != null) {
            const sigilValue = sigilSlot.Value
            const sigilName = sigilSlot.Name
            if (sigilName == sellSigilName) {
                playerData.TotemData.NormalSlots[i] = null
                await updatePlayerAndSellValue(playerRef, playerData, sigilValue, conversionsDatasheet)
                return sigilValue
            }
        }
    }

    for (let i = 0; i < totemDatasheet.BonusSlots; i++) {
        const sigilSlot = playerData.TotemData.BonusSlots[i]
        if (sigilSlot.Unlocked && sigilSlot.Sigil != null) {
            const sigilName = sigilSlot.Sigil.Name
            const sigilValue = sigilSlot.Sigil.Value
            if (sigilName == sellSigilName) {
                playerData.TotemData.BonusSlots[i].Sigil = null
                await updatePlayerAndSellValue(playerRef, playerData, sigilValue, conversionsDatasheet)
                return sigilValue
            }
        }
    }

    if (playerData.TotemData.RitualSlot != null && !playerData.TotemData.RitualRunning) {
        const sigilName = playerData.TotemData.RitualSlot.Name
        const sigilValue = playerData.TotemData.RitualSlot.Value
        if (sigilName == sellSigilName) {
            playerData.TotemData.RitualSlot = null
            await updatePlayerAndSellValue(playerRef, playerData, sigilValue, conversionsDatasheet)
            return sigilValue
        }
    }

    return -1
}