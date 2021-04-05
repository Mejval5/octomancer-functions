import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const _createCrystalCostsDatasheet = functions.pubsub.topic('create-new-crystal-costs-datasheet').onPublish(async () => {
    const data = CreateData()
    await admin.firestore().collection('Datasheets').doc('CrystalCosts').set(data);
})


function CreateData() {
    const data: {[key: string]: any} = {}
    data["RollAgain"] = CreateRollAgain()
    data["RollAgainCumulative"] = CreateRollAgainCumulative(data["RollAgain"])
    return data
}

function CreateRollAgain() {
    const data: {[key: number]: number} = {}
    for (let i = 0; i < 20; i++) {
        data[i] = 5 * i * i
    }
    return data
}
function CreateRollAgainCumulative(rollAgain: {[key: number]: number}) {
    const data: {[key: number]: number} = {}
    data[0] = rollAgain[0]
    for (let i = 1; i < 20; i++) {
        data[i] = rollAgain[i] + data[i-1]
    }
    return data
}