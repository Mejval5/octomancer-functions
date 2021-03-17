import {InitTrap} from './TrapPosition'
import {InitStart, InitExit} from './EnterAndExitPosition'

export const levelData = {
  Shape: "00",
  Style: "01",
  TrapPositions: InitTraps(),
  EnterAndExitPositions: InitEnterAndExit(),
}

function InitTraps () {
    let traps: { [key: string]: any } = {}
    traps["01"] = InitTrap("Muscle")
    traps["02"] = InitTrap("Piranha")
    traps["03"] = InitTrap("Urchin")
    traps["04"] = InitTrap("Tentacle")
    traps["05"] = InitTrap("StaticCanon")
    return traps
}

function InitEnterAndExit () {
    let traps: { [key: string]: any } = {}
    traps["Start"] = InitStart()
    traps["Exit"] = InitExit()
    return traps
}