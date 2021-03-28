import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {StartTaskInQueue} from './HelperMethods'

export const _removeAttackTargetAfterTime = functions.firestore.document(
    '/Players/{playerID}/EnemiesAttacked/{enemyID}'
    ).onCreate(async (snap, context) => {
    const data = {playerID: context.params.playerID, enemyID: context.params.enemyID}
    const timeNow = admin.firestore.Timestamp.now()
    const deleteAfterSeconds = timeNow.seconds +  60 * 60
    await StartTaskInQueue("delete-attack-target", "removeAttackTarget", data, deleteAfterSeconds)
})