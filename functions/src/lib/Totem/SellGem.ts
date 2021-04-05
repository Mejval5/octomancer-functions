import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'

export const _sellGem = functions.https.onCall(async (_data) => {
    const gem = _data.gem
    const authToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    const gemData = GetGem(playerData, gem)

    if (playerData.TotemData.Gems !== {}) {
        const gemRitualDatasheet = (await admin.firestore().collection("Datasheets").doc("Conversions").get()).data()
        if (gemRitualDatasheet === undefined) {
            return {success: false, message: "Bad datasheet"}
        }
        const moneyFromGem = gemData.Value * gemRitualDatasheet.GemValueToGoldValue
        await admin.firestore().collection('Players').doc(playerData.PlayerName).update({
            CurrentMoney: admin.firestore.FieldValue.increment(moneyFromGem)
        })

        if (playerData.TotemData.RitualRunning && [20, 21, 22].includes(gemData.Position)) {
            await StopRitual(playerData.PlayerName)
        }
        console.log(Object.keys(playerData.TotemData.Gems))
        delete playerData.TotemData.Gems[gem]
        console.log(Object.keys(playerData.TotemData.Gems))
        console.log(Object.keys(playerData.TotemData.Gems).length)
        await admin.firestore().collection('Players').doc(playerData.PlayerName).update({
            'TotemData.Gems': playerData.TotemData.Gems
        })
        return {success: true, message: "Gem sold"}
    }
    return {success: false, message: "Gem not found"}
})


function GetGem (playerData: FirebaseFirestore.DocumentData, gem: string) {
    if (gem in playerData.TotemData.Gems) {
        return playerData.TotemData.Gems[gem]
    }
    return {}
}

async function StopRitual(playerName: string) {
    await admin.firestore().collection('Players').doc(playerName).update({
        'TotemData.RitualRunning': false,
        'TotemData.RitualFinishedPackage': {}
          })
}