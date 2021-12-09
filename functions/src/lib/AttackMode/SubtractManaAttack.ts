import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthTokenWithRef} from '../HelperMethods/GoogleMethods'
import { UpdateMana } from '../GameLogic/Currencies/ManaUpdater'

export const _subtractManaAttack = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken
    const [playerData, playerRef] = await GetPlayerByAuthTokenWithRef(authToken)
    if (playerData === null || playerRef === null) {
        return {success: false, message: "Player not found"}
    }

    let enemyAttackable = false

    const attackToken = _data.attackToken
    const previousEnemiesTask = admin.firestore().collection('Players').
    doc(playerData.PlayerName).collection('EnemiesAttacked').get()

    const updateManaTask = UpdateMana(playerData, playerRef)

    const [previousEnemies, manaUpdatedData] = await Promise.all([previousEnemiesTask, updateManaTask])

    let enemyAttackedData: FirebaseFirestore.DocumentData = {}

    for (const enemy of previousEnemies.docs) {
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

    const currentMana = manaUpdatedData[0] as number

    const manaCost = enemyAttackedData.PortalCost
    let newMana = currentMana - manaCost

    if (newMana == -1) {
        newMana = 0
    }

    if (newMana < -1) {
        return {success: false, message: "You don't have mana. Cheating?"}
    }

    await playerRef.update({
        'ManaData.CurrentMana': newMana,
    })


    return {success: true, message: "Portal successful.", mana: JSON.stringify(newMana), lastUpdate: JSON.stringify(manaUpdatedData[1])}
})
