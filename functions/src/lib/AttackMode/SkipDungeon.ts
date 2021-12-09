import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import { getAttackTargetEnemy } from './FinishAttack'
import { currencyCostsDatasheetType } from '../Types/DatasheetTypes'
//import * as admin from 'firebase-admin'


export const _skipDungeon = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken as string
    const attackToken = _data.attackToken as string
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    const getAttackEnemyTask = getAttackTargetEnemy(attackToken, playerData.PlayerName)
    const costsDatasheetTask = admin.firestore().collection("Datasheets").doc('CurrencyCosts').get()

    const [[enemyAttackable, enemyAttackedData], costsDatasheetSnap] = await Promise.all([getAttackEnemyTask, costsDatasheetTask])
    
    if(!enemyAttackable) {
        return {success: false, message: "you cant attack just anyone"}
    }

    const costDatasheet = costsDatasheetSnap.data() as currencyCostsDatasheetType
    const skipCost = costDatasheet.SkipCost
    
    if (playerData.CurrentPearls < skipCost) {
        return {success: false, message: "Not enough pearls"}
    }

    const subtractPearlsTask = admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        CurrentPearls: admin.firestore.FieldValue.increment(- skipCost),
    })

    const skipEnemyTask = admin.firestore().collection('Players').doc(playerData.PlayerName).
        collection('EnemiesAttacked').doc(enemyAttackedData.TargetName).update({
            AlreadyAttacked: true,
            Stars: 0
        })

    await Promise.all([subtractPearlsTask, skipEnemyTask])

    return {success: true, message: "Dungeon skipped"}
})