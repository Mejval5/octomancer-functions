import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { currencyCostsDatasheetType, spinAgainDatasheetType } from '../Types/DatasheetTypes';

export const _createCurrencyCostsDatasheet = functions.pubsub.topic('create-new-currency-costs-datasheet').onPublish(async () => {
    const data = CreateData()
    await admin.firestore().collection('Datasheets').doc('CurrencyCosts').set(data);
})

function CreateData() {
    const data = {} as currencyCostsDatasheetType
    data.SkipCost = 200
    data.SpinAgain = CreateSpinAgain()
    data.SpinAgainCumulative = CreateSpinAgainCumulative(data.SpinAgain)
    return data
}

function CreateSpinAgain() {
    const data = {} as spinAgainDatasheetType
    for (let i = 0; i < 20; i++) {
        data[i] = 5 * (i + 1) * (i + 1)
    }
    return data
}
function CreateSpinAgainCumulative(spinAgain: spinAgainDatasheetType) {
    const data = {} as spinAgainDatasheetType
    data[0] = spinAgain[0]
    for (let i = 1; i < 20; i++) {
        data[i] = spinAgain[i] + data[i-1]
    }
    return data
}