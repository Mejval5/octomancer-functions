import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'

export const _finishAttack = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    let enemyAttackable = false
    const stars = _data.stars

    const attackToken = _data.attackToken
    const previousEnemies = (await admin.firestore().collection('Players').
    doc(playerData.PlayerName).collection('EnemiesAttacked').get()).docs

    let enemyAttackedData: FirebaseFirestore.DocumentData = {}

    for (const enemy of previousEnemies) {
        const enemyData = enemy.data()
        if (enemyData.attackToken === attackToken && !enemyData.attacked) {
            enemyAttackable = true
            enemyAttackedData = enemyData
            break
        }
    }

    if(!enemyAttackable) {
        return {message: "you cant attack just anyone", success: false}
    }

    await admin.firestore().collection('Players').doc(playerData.PlayerName).
        collection('EnemiesAttacked').doc(enemyAttackedData.name).update({
            attacked: true,
            stars: stars
        })

    const returnDiceRolls: {[key: string]: any} = {}
    returnDiceRolls.diceRolls = enemyAttackedData.diceRolls
    return {success: true, message: "Attack successful. Now roll.",
    diceRolls: JSON.stringify(returnDiceRolls)}
})