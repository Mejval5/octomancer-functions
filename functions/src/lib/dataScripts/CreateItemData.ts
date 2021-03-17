import {itemData} from './ItemData'

export function createItemData () {
  let items: { [key: string]: any } = {}
  items["DoorUpgrade"] = itemData
  items["GoldMineMaxUpgrade"] = itemData
  items["KeysMaxUpgrade"] = itemData
  items["KeysRegenUpgrade"] = itemData
  items["GoldMineSpeedUpgrade"] = itemData
  items["KillMoneyUpgrade"] = itemData
  items["GemDefenseUpgrade"] = itemData
  items["MerchantUpgrade"] = itemData
  items["HealthSaverUpgrade"] = itemData
  items["KeySaverUpgrade"] = itemData
  items["TotemSaverUpgrade"] = itemData
  items["RitualSpeedUpgrade"] = itemData
  return items
}