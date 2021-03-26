import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {gem} from './dataScripts/Gem'
import {GetRandomDocumentID} from './HelperMethods'

export const _addNewGemToTotem = functions.pubsub.topic('add-new-gem').onPublish(async (message) => {
    let playerName = null
    let gemName = null
    let gemType = null
    let gemValue = null

    try {
        playerName = message.json.playerName
        gemName = message.json.gemName
        gemType = message.json.gemType
        gemValue = message.json.gemValue
    } catch (e) {
      console.error('PubSub message was not JSON', e)
      return
    }

    if (gemType === undefined || gemValue === undefined || playerName === undefined) {
        return
    }
    
    if (gemName === undefined) {
        gemName = GetRandomDocumentID()
    }

    let gemValueToSell = 0
    const newGem = Object.assign({}, gem)
    newGem.Type = parseInt(gemType)
    newGem.Value = parseInt(gemValue)
    const playerRef = admin.firestore().collection('Players').doc(playerName)
    const playerData = (await playerRef.get()).data()
    if (playerData !== undefined) {
        const availableSlots = GetAvailableSlots(playerData)
        const availableSlotCount = Object.keys(availableSlots).length
        const playerGems = playerData.TotemData.Gems
        if (availableSlotCount >= 1) {
            newGem.Position = availableSlots[0]
            await AddNewGem(playerRef, newGem, gemName, playerGems)
        } else {
            const lowestGemInInventory = FindLowestGem(playerGems, playerData.TotemData.RitualRunning)
            if (playerGems[lowestGemInInventory].Value < newGem.Value) {
                newGem.Position = playerGems[lowestGemInInventory].Position
                gemValueToSell = playerGems[lowestGemInInventory].Value
                await RemoveGem(playerRef, lowestGemInInventory, playerGems)
                await AddNewGem(playerRef, newGem, gemName, playerGems)
            } else {
                gemValueToSell = newGem.Value
            }
        }
        await SellGem(gemValueToSell, playerRef)
    }
})

async function SellGem(gemValueToSell: number, playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>) {
    const conversions = (await admin.firestore().collection('Datasheets').doc("Conversions").get()).data()
    if (conversions !== undefined) {
        const moneyToReceive = gemValueToSell * conversions.GemValueToGoldValue
        await playerRef.update({
            CurrentMoney: admin.firestore.FieldValue.increment(moneyToReceive)
        })
    }
}

function FindLowestGem(playerGems: { [key: string]: any }, ritualRunning: boolean) {
    let lowestGemValue = Infinity
    let lowestGemKey = ""
    Object.keys(playerGems).forEach(key => {
        if (playerGems[key].Value < lowestGemValue) {
            if (ritualRunning && playerGems[key].Position >= 20) {
                return
            }
            lowestGemValue = playerGems[key].Value
            lowestGemKey = key
        }
    })
    return lowestGemKey
}

async function AddNewGem(playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
    newGem: any, gemName: string, playerGems: { [key: string]: any}) {
    const newPlayerGems = Object.assign({}, playerGems)
    newPlayerGems[gemName] = newGem
    await UpdateGems(playerRef, newPlayerGems)
}

async function RemoveGem(playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
    gemKey: string, playerGems: { [key: string]: any}) {
    const newPlayerGems = playerGems
    delete newPlayerGems[gemKey]
    await UpdateGems(playerRef, newPlayerGems)
}

async function UpdateGems(playerRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
    playerGems: { [key: string]: any}) {
    await playerRef.update({'TotemData.Gems': playerGems})
}

function GetAvailableSlots (playerData: any) {
    let availableSlots: number[] = []
    // Fill the inventory slots
    for (let k = 0; k < 12; k++) {
        availableSlots.push(k)
    }
    // Fill the totem slots if the ritual is not running
    if (!playerData.TotemData.RitualRunning) {
        for (let j = 0; j < 3; j++) {
            availableSlots.push(20+j)
        }
    }
    // Remove all slots with gems
    Object.keys(playerData.TotemData.Gems).forEach(key => {
        const slotVal = playerData.TotemData.Gems[key].Position
        availableSlots = availableSlots.filter(item => item !== slotVal)
    })
    // Remove all locked slots
    for (let i = 0; i < 6; i++) {
        if (!playerData.TotemData.BonusSlots[i.toString()]) {
            const slotVal = i+9
            availableSlots = availableSlots.filter(item => item !== slotVal)
        }
    }
    // Return all available slots as array of numbers
    return availableSlots
}