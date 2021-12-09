import { allTrapItemsType, trapEnum } from "../Types/TrapTypes"
import {newTrapItemData} from './TrapData'

export function createTrapData () {
  const traps: allTrapItemsType = {} as allTrapItemsType
  traps[trapEnum[trapEnum.Urchin]] = newTrapItemData
  traps[trapEnum[trapEnum.Dropper]] = newTrapItemData
  traps[trapEnum[trapEnum.Muscle]] = newTrapItemData
  traps[trapEnum[trapEnum.StaticCanon]] = newTrapItemData
  traps[trapEnum[trapEnum.ElectroRock]] = newTrapItemData
  traps[trapEnum[trapEnum.Tentacle]] = newTrapItemData
  traps[trapEnum[trapEnum.Piranha]] = newTrapItemData
  return traps
}