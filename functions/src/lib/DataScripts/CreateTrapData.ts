import { allTrapItemsType } from "../Types/TrapTypes"
import {newTrapItemData} from './TrapData'

export function createTrapData () {
  const traps: allTrapItemsType = {} as allTrapItemsType
  traps.Urchin = newTrapItemData
  traps.Dropper = newTrapItemData
  traps.Muscle = newTrapItemData
  traps.StaticCanon = newTrapItemData
  traps.ElectroRock = newTrapItemData
  traps.Tentacle = newTrapItemData
  traps.Piranha = newTrapItemData
  return traps
}