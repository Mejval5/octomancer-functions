import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _createAttackRewardsDatasheet = functions.pubsub.topic('create-new-attack-rewards-datasheet').onPublish(async () => {
    const data = CreateData()
    await admin.firestore().collection('Datasheets').doc('AttackRewards').set(data);
})


function CreateData() {
    const data: {[key: string]: any} = {}
    data["oneStar"] = CreateOneStar()
    data["twoStars"] = CreateTwoStar()
    data["threeStars"] = CreateThreeStar()
    return data
}

function CreateOneStar() {
    const data: {[key: number]: any} = {}
    for (let i = 1; i <= 12; i++) {
        data[i] = {}
        data[i].gem = false
        data[i].crystals = 0
        data[i].xp = 1
        data[i].gold = 1
        if (i >= 8) {
            data[i].xp = 1.1
        }
        if (i >= 9) {
            data[i].xp = 1.2
        }
        if (i >= 10) {
            data[i].gem = true
        }
        if (i >= 11) {
            data[i].gold = 1.2
        }
        if (i >= 12) {
            data[i].crystals = 5
        }
    }
    return data
}
function CreateTwoStar() {
    const data: {[key: number]: any} = {}
    for (let i = 1; i <= 12; i++) {
        data[i] = {}
        data[i].gem = false
        data[i].crystals = 0
        data[i].xp = 1
        data[i].gold = 1
        if (i >= 6) {
            data[i].xp = 1.1
        }
        if (i >= 8) {
            data[i].xp = 1.2
        }
        if (i >= 9) {
            data[i].gem = true
        }
        if (i >= 10) {
            data[i].gold = 1.2
        }
        if (i >= 11) {
            data[i].xp = 1.5
        }
        if (i >= 12) {
            data[i].crystals = 10
        }
    }
    return data
}
function CreateThreeStar() {
    const data: {[key: number]: any} = {}
    for (let i = 1; i <= 12; i++) {
        data[i] = {}
        data[i].gem = false
        data[i].crystals = 0
        data[i].xp = 1
        data[i].gold = 1
        if (i >= 4) {
            data[i].xp = 1.1
        }
        if (i >= 5) {
            data[i].xp = 1.2
        }
        if (i >= 6) {
            data[i].gold = 1.2
        }
        if (i >= 7) {
            data[i].gem = true
        }
        if (i >= 8) {
            data[i].xp = 1.5
        }
        if (i >= 10) {
            data[i].gold = 1.5
        }
        if (i >= 11) {
            data[i].xp = 2
        }
        if (i >= 12) {
            data[i].crystals = 20
        }
    }
    return data
}
