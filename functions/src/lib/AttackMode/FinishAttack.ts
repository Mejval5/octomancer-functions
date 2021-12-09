import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import { attackTargetFirebaseType, spinsEnemyType } from '../Types/AttackTypes'

export const _finishAttack = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken as string
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    const stars = _data.stars as number

    const [enemyAttackable, enemyAttackedData] = await getAttackTargetEnemy(_data.attackToken, playerData.PlayerName)
    if(!enemyAttackable) {
        return {message: "you cant attack just anyone", success: false}
    }

    await admin.firestore().collection('Players').doc(playerData.PlayerName).
        collection('EnemiesAttacked').doc(enemyAttackedData.TargetName).update({
            AlreadyAttacked: true,
            Stars: stars
        })

    let returnSpins = {} as spinsEnemyType
    returnSpins = enemyAttackedData.Spins
    return {success: true, message: "Attack successful. Now spin.",
    spins: JSON.stringify(returnSpins)}
})

export async function getAttackTargetEnemy(attackToken: string, playerName: string):
Promise<[boolean, attackTargetFirebaseType]> {

    const previousEnemies = (await admin.firestore().collection('Players').
    doc(playerName).collection('EnemiesAttacked').get()).docs

    let enemyAttackable = false
    let enemyAttackedData = {} as attackTargetFirebaseType

    for (const enemy of previousEnemies) {
        const enemyData = enemy.data()
        if (enemyData.attackToken === attackToken && !enemyData.attacked) {
            enemyAttackable = true
            enemyAttackedData = enemyData as attackTargetFirebaseType
            break
        }
    }
    return [enemyAttackable, enemyAttackedData]
}
