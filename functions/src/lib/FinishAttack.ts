import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from './HelperMethods'

export const _finishAttack = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    let enemyAttackable = false
    const stars = _data.stars

    const attackToken = _data.attackToken
    const previousEnemies = await admin.firestore().collection('Players').
    doc(playerData.PlayerName).collection('EnemiesAttacked').get()

    let enemyAttackedData: FirebaseFirestore.DocumentData = {}
    previousEnemies.forEach((enemy) => {
        enemyAttackedData = enemy.data()
        if (enemyAttackedData.attackToken === attackToken && !enemyAttackedData.attacked) {
            enemyAttackable = true
        }
    })

    if(!enemyAttackable) {
        return {message: "you cant attack just anyone", success: false}
    }

    await admin.firestore().collection('Players').doc(playerData.PlayerName).
        collection('EnemiesAttacked').doc(enemyAttackedData.name).update({
            attacked: true,
            stars: stars
        })


    return {success: true, message: "Attack successful. Now roll.", rolls: enemyAttackedData.diceRolls}
})
