import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { attackRewardsDatasheetType, starDatasheetType, starsDatasheetType } from '../Types/DatasheetTypes';

export const _createAttackRewardsDatasheet = functions.pubsub.topic('create-new-attack-rewards-datasheet').onPublish(async () => {
    const data = CreateData()
    await admin.firestore().collection('Datasheets').doc('AttackRewards').set(data);
})

function CreateData() {
    const data = {} as attackRewardsDatasheetType
    data.RewardsByStars = CreateStars()
    data.BaseXP = 500
    return data
}

function CreateStars() {
    const data = {} as starsDatasheetType
    data[1] = CreateOneStar()
    data[2] = CreateTwoStar()
    data[3] = CreateThreeStar()
    return data        
}

function CreateOneStar() {
    const data = {} as starDatasheetType
    data.PearlsMult = 0.3
    data.XPMult = 1
    data.SigilChance = 0.05
    return data
}

function CreateTwoStar() {
    const data = {} as starDatasheetType
    data.PearlsMult = 0.15
    data.XPMult = .5
    data.SigilChance = 0.25
    return data
}

function CreateThreeStar() {
    const data = {} as starDatasheetType
    data.PearlsMult = 0.03
    data.XPMult = .1
    data.SigilChance = 0.5
    return data
}
