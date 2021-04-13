import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GetPlayerByAuthToken} from '../HelperMethods/GoogleMethods'
import {AddGemToPlayer} from '../Totem/AddNewGemToTotem'

export const _finishAttackRolls = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken
    const attackToken = _data.attackToken
    const playerRoll = _data.diceRoll
    const playerData = await GetPlayerByAuthToken(authToken)
    if (playerData === null) {
        return {success: false, message: "Player not found"}
    }

    let enemyAttackable = false

    const previousEnemies = (await admin.firestore().collection('Players').
    doc(playerData.PlayerName).collection('EnemiesAttacked').get()).docs

    let enemyAttackedData: FirebaseFirestore.DocumentData = {}

    for (const enemy of previousEnemies) {
        const enemyData = enemy.data()
        if (enemyData.attackToken === attackToken && enemyData.attacked) {
            enemyAttackable = true
            enemyAttackedData = enemyData
            break
        }
    }

    if(!enemyAttackable) {
        return {message: "you cant attack just anyone", success: false}
    }

    const _datasheet = GetDatasheet(enemyAttackedData.stars)
    const _baseReward = GetBaseReward(enemyAttackedData.stars, enemyAttackedData.money)
    const _costDatasheet = await admin.firestore().collection("Datasheets").doc('CrystalCosts').get()
    let [datasheet, baseReward, costDatasheet] = await Promise.all([_datasheet, _baseReward, _costDatasheet]);
    const costDatasheetData = costDatasheet.data()

    // diceRoll from 0 to 19
    const receivedDiceRoll = Math.min(Math.max(Math.floor(playerRoll),0),19)
    const rolledDice = enemyAttackedData.diceRolls[receivedDiceRoll]
    let rollSum =  Math.min(Math.max(rolledDice.dice1 + rolledDice.dice2,1),12)
    // last roll is always 12 to give reward for completing the infinite game
    if (receivedDiceRoll === 19) {
        rollSum = 12
    }
    
    if (costDatasheetData === undefined) {
        return {message: "Crystal cost datasheet missing!", success: false}
    }
    const crystalCost = costDatasheetData["RollAgainCumulative"][playerRoll]
    if (playerData.CurrentCrystals < crystalCost) {
        return {message: "Not enough crystals", success: false}
    }

    const reward = datasheet[rollSum]
    const crystals = reward.crystals - crystalCost
    const gem = reward.gem
    const gold = Math.floor(reward.gold * baseReward.gold)
    const xp = Math.floor(reward.xp * baseReward.xp)

    const addResources = admin.firestore().collection('Players').doc(playerData.PlayerName).update({
        CurrentMoney: admin.firestore.FieldValue.increment(gold),
        CurrentXP: admin.firestore.FieldValue.increment(xp),
        CurrentCrystals: admin.firestore.FieldValue.increment(crystals),
    })

    if (gem && enemyAttackedData.gem !== {}) {
        const addGem = AddGemToPlayer(playerData.PlayerName, "", enemyAttackedData.gem.Type, enemyAttackedData.gem.Value)
        await Promise.all([addGem, addResources])
    } else {
        await Promise.all([addResources])
    }


    return {success: true, message: "Rewards received"}
})

async function GetDatasheet(stars: number) {
    const datasheet = (await admin.firestore().collection('Datasheets').doc('AttackRewards').get()).data()
    if (datasheet === undefined) {
        return {crystals: 0, gem: false, gold: 1, xp: 1}
    }
    if (stars === 3) {
        return datasheet.threeStars
    } else if (stars === 2) {
        return datasheet.twoStars
    } else {
        return datasheet.oneStar
    }
}

async function GetBaseReward(stars: number, gold: number) {
    const datasheet = (await admin.firestore().collection('Datasheets').doc('GeneralAttackRewards').get()).data()
    if (datasheet === undefined) {
        return {gold: 0, xp: 0}
    }
    const returnValues: {[key: string]: any} = {}
    returnValues.gold = Math.floor(datasheet.gold[stars] * gold)
    returnValues.xp = datasheet.xp[stars]
    return returnValues
}
