import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
//import * as admin from 'firebase-admin'


export const _skipDungeon = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }
    const money = - _data.money
    if (playerData.CurrentMoney < money) {
        return {success: false, message: "Not enough money"}
    }
    await admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        CurrentMoney: admin.firestore.FieldValue.increment(money),
    })

    let enemyAttackable = false

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
        return {message: "Cant skip this guy!", success: false}
    }

    await admin.firestore().collection('Players').doc(playerData.PlayerName).
        collection('EnemiesAttacked').doc(enemyAttackedData.name).update({
            attacked: true,
            stars: 0
        })
        return {message: "Dungeon skipped", success: true}
})