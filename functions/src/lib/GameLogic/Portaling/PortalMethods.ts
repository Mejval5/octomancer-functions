import { itemDatasheetType } from '../../Types/DatasheetTypes'
import { playerTypeFirebase } from '../../Types/PlayerTypes'
import { GetRandomInt } from '../../HelperMethods/GameMethods'

export function calculateManaByPortals(amount: number, playerData: playerTypeFirebase, itemDatasheet: itemDatasheetType) {
    const manaCostPerPortal = getManaCostPerPortalFromData(playerData, itemDatasheet)
    return amount * manaCostPerPortal
}

export function getAmountOfPortals(playerData: playerTypeFirebase, itemDatasheet: itemDatasheetType) {
    const upgrade = playerData.ItemData.PortalDefenseUpgrade.ItemLevel
    return itemDatasheet.PortalDefenseUpgrade[upgrade]
}

export function getAmountOfPortalsBot(itemDatasheet: itemDatasheetType) {
    const upgrade = GetRandomInt(1, 4)
    return itemDatasheet.PortalDefenseUpgrade[upgrade]
}

function getManaCostPerPortal(upgrade: number, itemDatasheet: itemDatasheetType) {
    const costsDatasheet = itemDatasheet.PortalDefenseUpgradeManaCost
    let outputCost = 0
    for (const costsKey of Object.keys(costsDatasheet)) {
        const numberCostKey = parseInt(costsKey)
        if (upgrade >= numberCostKey) {
            outputCost = costsDatasheet[numberCostKey]
        }
        else {
            break
        }
    }
    return outputCost
}

export function getManaCostPerPortalFromData(playerData: playerTypeFirebase, itemDatasheet: itemDatasheetType) {
    const upgrade = playerData.ItemData.PortalDefenseUpgrade.ItemLevel
    return getManaCostPerPortal(upgrade, itemDatasheet)
}

export function getManaCostPerPortalFromDataBot(itemDatasheet: itemDatasheetType) {
    const upgrade = GetRandomInt(1, 4)
    return getManaCostPerPortal(upgrade, itemDatasheet)
}