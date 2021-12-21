import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {StartTaskInQueue, CancelTask} from '../HelperMethods/GoogleMethods'

export const _removeAttackTargetAfterTime = functions.firestore.document(
    '/Players/{playerName}/EnemiesAttacked/{enemyName}'
    ).onWrite(async (change, context) => {
        
    const _dataBefore = change.before.data()
    const _dataAfter = change.after.data()
    if (change.after.exists && change.before.exists) {
        if (_dataBefore !== undefined && _dataAfter !== undefined) {
            if (JSON.stringify(_dataBefore.addedTime) === JSON.stringify(_dataAfter.addedTime)) {
                return
            }
        }
    }

    if (change.before.exists) {
        if (_dataBefore !== undefined) {
            try {
                await CancelTask(_dataBefore.removeTask)
            } catch {}
        }
    }
    if (!change.after.exists) {
        return
    }


    const data = {playerName: context.params.playerName, enemyName: context.params.enemyName}
    const timeNow = admin.firestore.Timestamp.now()
    const deleteAfterSeconds = timeNow.seconds +  60 * 60
    const removeTask = await StartTaskInQueue("delete-attack-target", "removeAttackTarget", data, deleteAfterSeconds)
    return change.after.ref.set({
        RemoveTask: String(removeTask)
      }, {merge: true})
    })