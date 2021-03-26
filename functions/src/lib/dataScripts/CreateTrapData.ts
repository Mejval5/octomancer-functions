import {trapData} from './TrapData'

export function createTrapData () {
  const traps: { [key: string]: any } = {}
  traps["Urchin"] = trapData
  traps["Dropper"] = trapData
  traps["Muscle"] = trapData
  traps["StaticCanon"] = trapData
  traps["ElectroRock"] = trapData
  traps["Tentacle"] = trapData
  traps["Piranha"] = trapData
  return traps
}