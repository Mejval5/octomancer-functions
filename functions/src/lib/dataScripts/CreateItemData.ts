import { allItemsType } from '../Types/ItemTypes'
import {newItemData} from './ItemData'


export function createItemData () {
  const items: allItemsType = {} as allItemsType
  items.PortalDefenseUpgrade = newItemData
  items.PearlMineMaxUpgrade = newItemData
  items.ManaMaxUpgrade = newItemData
  items.ManaRegenUpgrade = newItemData
  items.PearlMineSpeedUpgrade = newItemData
  items.SkullPriceUpgrade = newItemData
  items.SigilDefenseUpgrade = newItemData
  items.MerchantUpgrade = newItemData
  items.HealthSaverUpgrade = newItemData
  items.ManaSaverUpgrade = newItemData
  items.RitualSpeedUpgrade = newItemData
  return items
}