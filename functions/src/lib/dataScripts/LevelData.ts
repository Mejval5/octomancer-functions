import {InitTrap} from './TrapPosition'
import {InitStart, InitExit} from './EnterAndExitPosition'

export const levelData = {
  Shape: "00",
  Style: "01",
  ChangedLayout: false,
  TrapPositions: InitTraps(),
  EnterAndExitPositions: InitEnterAndExit()
}

function InitTraps () {
    const traps: { [key: string]: any } = {}
    traps["01"] = InitTrap("Muscle")
    traps["02"] = InitTrap("Piranha")
    traps["03"] = InitTrap("Urchin")
    traps["04"] = InitTrap("Dropper")
    traps["05"] = InitTrap("StaticCanon")
    return traps
}

function InitEnterAndExit () {
    const traps: { [key: string]: any } = {}
    traps["Start"] = InitStart()
    traps["Exit"] = InitExit()
    return traps
}