import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as _ from 'lodash'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import {addSigilToPlayer} from '../Totem/AddNewSigilToTotem'
import { attackRewardsDatasheetType, currencyCostsDatasheetType } from '../Types/DatasheetTypes'
import { attackTargetFirebaseType } from '../Types/AttackTypes'

export const _finishAttackSpins = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken as string
    const attackToken = _data.attackToken as string
    const playerFinalSpin = _data.finalSpin as number
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    let enemyAttackable = false

    const previousEnemies = await admin.firestore().collection('Players').
    doc(playerData.PlayerName).collection('EnemiesAttacked').get()

    let enemyAttackedData: FirebaseFirestore.DocumentData = {}
    
    for (const enemy of previousEnemies.docs) {
        const enemyData = enemy.data() as attackTargetFirebaseType
        if (enemyData.AttackToken === attackToken) {
            enemyAttackable = true
            enemyAttackedData = enemyData
            break
        }
    }

    if(!enemyAttackable) {
        return {message: "you cant attack just anyone", success: false}
    }


    const currencyCostDatasheetTask = admin.firestore().collection("Datasheets").doc('CurrencyCosts').get()
    const attackRewardsTask = admin.firestore().collection('Datasheets').doc('AttackRewards').get()
    let [currencyCostDatasheetSnap, attackRewardsSnap] = await Promise.all([currencyCostDatasheetTask, attackRewardsTask]);

    const costsDatasheet = currencyCostDatasheetSnap.data() as currencyCostsDatasheetType
    const attackRewards = attackRewardsSnap.data() as attackRewardsDatasheetType
    
    if (costsDatasheet == null) {
        return {message: "Crystal cost datasheet missing!", success: false}
    }

    // spins from 0 to 19
    const receivedSpin = Math.min(Math.max(Math.floor(playerFinalSpin),0), _.size(costsDatasheet.SpinAgain))
    const finalSpin = enemyAttackedData.Spins[receivedSpin]

    const gemCost = costsDatasheet.SpinAgainCumulative[finalSpin]

    if (playerData.CurrentGems < gemCost) {
        return {message: "Not enough crystals", success: false}
    }

    const starRewards = attackRewards.RewardsByStars[enemyAttackedData.Stars]
    const sigilChance = starRewards.SigilChance
    const pearls = Math.floor(starRewards.PearlsMult * enemyAttackedData.Pearls)
    const xp = Math.floor(starRewards.XPMult * attackRewards.BaseXP)

    const addResourcesTask = admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        CurrentPearls: admin.firestore.FieldValue.increment(pearls),
        CurrentXP: admin.firestore.FieldValue.increment(xp),
    })

    if (enemyAttackedData.Sigil != null && finalSpin <= sigilChance) {
        const addSigil = addSigilToPlayer(playerData.PlayerName,
            enemyAttackedData.Sigil.Name, enemyAttackedData.Sigil.Type, enemyAttackedData.Sigil.Value)
        await Promise.all([addSigil, addResourcesTask])
    } else {
        await Promise.all([addResourcesTask])
    }
    return {success: true, message: "Rewards received"}
})
