import {UpdatePlayerData01} from './PlayerUpdate01'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import {UpdateMana} from '../../GameLogic/Currencies/ManaUpdater'

export async function UpdatePlayerAll(playerName: string) {
    const playerRef = admin.firestore().collection('Players').doc(playerName)
    let playerData = (await playerRef.get()).data();
    if (playerData != null) {
        await UpdatePlayerCurrencies(playerData, playerRef)
    }
}

async function UpdatePlayerCurrencies(playerData: admin.firestore.DocumentData, playerRef: admin.firestore.DocumentReference) {
    if (playerData != null) {
        await UpdateMana(playerData, playerRef)
    }
}



export const _updateAllPlayers = functions.pubsub.topic('update-all-players').onPublish(async () => {
    const allPlayers = await admin.firestore().collection('Players').get()
    if (allPlayers.empty) {
        console.log('No players.');
        return;
    }

    const tasks: Promise<void>[] = []

    allPlayers.forEach(doc => {
        const ref = admin.firestore().collection('Players').doc(doc.id)
        tasks.push(UpdatePlayerFirebaseData(ref))
    });
    await Promise.all(tasks)
    
})

async function UpdatePlayerFirebaseData(playerRef: admin.firestore.DocumentReference) {
    let playerData = (await playerRef.get()).data();
    if (playerData != null) {
        await UpdatePlayerData01(playerData, playerRef)
    }
}