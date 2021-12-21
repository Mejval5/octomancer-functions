import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthTokenWithRef} from '../../HelperMethods/GoogleMethods'
import { playerTypeFirebase } from '../../Types/PlayerTypes'
import { xpDatasheet } from '../../Types/DatasheetTypes'

export const _updateXP = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken

    const getPlayerTask = GetPlayerByAuthTokenWithRef(authToken)
    const getDatasheetXPTask = admin.firestore().collection('Datasheets').doc('XPdatasheet').get()

    let [[playerData, playerRef], datasheetXPSnap] = await Promise.all([getPlayerTask, getDatasheetXPTask])

    const datasheetXP = datasheetXPSnap.data() as xpDatasheet 

    if (playerData == null || playerRef == null) {
        return {success: false, message: "Player not found"}
    }

    const [currentXP, currentLevel] = await UpdateXP(playerData, playerRef, datasheetXP)

    return {success: true, message: "XP updated",
    currentXP: JSON.stringify(currentXP), currentLevel: JSON.stringify(currentLevel)}
})

export async function UpdateXP(playerData: playerTypeFirebase,
    playerRef: admin.firestore.DocumentReference, datasheetXP: xpDatasheet) {
    
    for (let i = 0; i < Object.keys(datasheetXP.CostPerLevelXP).length; i++) {
        const xpCost = datasheetXP.CostPerLevelXP[playerData.CurrentLevel]
        if (xpCost <= playerData.CurrentXP) {
            playerData.CurrentXP -= xpCost
            playerData.CurrentLevel += 1
        } else {
            break
        }
    }

    await playerRef.update({
        'CurrentXP': playerData.CurrentXP,
        'CurrentLevel': playerData.CurrentLevel,
    })

    return [playerData.CurrentXP, playerData.CurrentLevel]
}