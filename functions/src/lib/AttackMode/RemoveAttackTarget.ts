import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _removeAttackTarget = functions.https.onRequest(async (req, res) => {
    const file = "/Players/"+req.body.playerName+"/EnemiesAttacked/"+req.body.enemyName
    try {
        await admin.firestore().doc(file).delete()
        res.sendStatus(200)
    }
    catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})