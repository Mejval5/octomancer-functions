import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthTokenWithRef} from '../../HelperMethods/GoogleMethods'
import { playerTypeFirebase } from '../../Types/PlayerTypes'

export const _updateMana = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken

    let [playerData, playerRef] = await GetPlayerByAuthTokenWithRef(authToken)

    if (playerData == null || playerRef == null) {
        return {success: false, message: "Player not found"}
    }

    const [newMana, lastUpdate] = await UpdateMana(playerData, playerRef)

    return {success: true, message: "Mana updated", mana: JSON.stringify(newMana), lastUpdate: JSON.stringify(lastUpdate)}
})

export async function UpdateMana(playerData: playerTypeFirebase, playerRef: admin.firestore.DocumentReference) {
    const timeNow = admin.firestore.Timestamp.now().toMillis()
    const lastTime = playerData.ManaData.LastManaUpdate.toMillis()
    const minutesElapsed = (timeNow - lastTime) / 1000 / 60

    const manaGained = minutesElapsed * playerData.ManaData.ManaPerMinute
    const manaGainedRounded = Math.floor(manaGained)
    const newManaUnbound = playerData.ManaData.CurrentMana + manaGainedRounded

    const newMana = Math.min(playerData.ManaData.MaxMana, newManaUnbound)

    await playerRef.update({
        'ManaData.CurrentMana': newMana,
        'ManaData.LastManaUpdate': admin.firestore.Timestamp.now(),
    })

    return [newMana, admin.firestore.Timestamp.now()]
}