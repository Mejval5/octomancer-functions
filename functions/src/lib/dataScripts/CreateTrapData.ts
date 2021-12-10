import { allTrapItemsType, trapEnum } from "../Types/TrapTypes"
import {newTrapItemData} from './TrapData'

export function createTrapData () {
  const traps: allTrapItemsType = {} as allTrapItemsType
  traps[trapEnum.Urchin] = newTrapItemData
  traps[trapEnum.Dropper] = newTrapItemData
  traps[trapEnum.Muscle] = newTrapItemData
  traps[trapEnum.StaticCanon] = newTrapItemData
  traps[trapEnum.ElectroRock] = newTrapItemData
  traps[trapEnum.Tentacle] = newTrapItemData
  traps[trapEnum.Piranha] = newTrapItemData
  return traps
}