import { trapPositionType, trapType } from "../Types/TrapTypes"

export const trapPosition: trapPositionType = {
  Type: "Urchin",
  PosX: 0,
  PosY: 0,
  RotZ: 0,
  FlipX: 0
}

export function InitTrap (_type: trapType) {
  const trap: trapPositionType = {} as trapPositionType
  trap.Type = _type
  trap.PosX = Math.round(Math.random() * 6 - 3)
  trap.PosY = Math.round(Math.random() * 6 - 3)
  trap.FlipX = 1
  trap.RotZ = 0
  return trap
}

export function InitStart () {
  const trap: trapPositionType = {} as trapPositionType
  trap.Type = "Start"
  trap.PosX = Math.round(Math.random() * 6 - 3)
  trap.PosY = Math.round(Math.random() * 8 - 10)
  trap.FlipX = 1
  trap.RotZ = 0
  return trap
}

export function InitExit () {
  const trap: trapPositionType = {} as trapPositionType
  trap.Type = "Exit"
  trap.PosX = Math.round(Math.random() * 6 - 3)
  trap.PosY = Math.round(Math.random() * 6 - 2)
  trap.FlipX = 1
  trap.RotZ = 0
  return trap
}