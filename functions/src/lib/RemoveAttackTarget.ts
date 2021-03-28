import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _removeAttackTarget = functions.https.onRequest(async (req, res) => {
    const file = "/Players/"+req.body.playerID+"/EnemiesAttacked/"+req.body.enemyID
    try {
        await admin.firestore().doc(file).delete()
        res.send(200)
    }
    catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})