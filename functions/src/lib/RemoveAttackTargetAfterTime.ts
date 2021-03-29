import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {StartTaskInQueue, CancelTask} from './HelperMethods'

export const _removeAttackTargetAfterTime = functions.firestore.document(
    '/Players/{playerID}/EnemiesAttacked/{enemyID}'
    ).onWrite(async (change, context) => {
        
    const _dataBefore = change.before.data()
    const _dataAfter = change.after.data()
    if (change.after.exists && change.before.exists) {
        if (_dataBefore !== undefined && _dataAfter !== undefined) {
            if (_dataBefore.addedTime === _dataAfter.addedTime) {
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


    const data = {playerID: context.params.playerID, enemyID: context.params.enemyID}
    const timeNow = admin.firestore.Timestamp.now()
    const deleteAfterSeconds = timeNow.seconds +  60 * 60
    const removeTask = await StartTaskInQueue("delete-attack-target", "removeAttackTarget", data, deleteAfterSeconds)
    return change.after.ref.set({
        removeTask: String(removeTask)
      }, {merge: true})
    })