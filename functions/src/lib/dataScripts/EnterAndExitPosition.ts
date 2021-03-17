export const trapPosition = {
  Name: '',
  PosX: 0,
  PosY: 0,
  RotZ: 0,
  FlipX: 0,
}

export function InitStart () {
  let trap = Object.assign({}, trapPosition)
  trap.Name = "Start"
  trap.PosX = Math.round(Math.random() * 6 - 3)
  trap.PosY = Math.round(Math.random() * 8 - 10)
  trap.FlipX = 1
  trap.RotZ = 0
  return trap
}

export function InitExit () {
  let trap = Object.assign({}, trapPosition)
  trap.Name = "Exit"
  trap.PosX = Math.round(Math.random() * 6 - 3)
  trap.PosY = Math.round(Math.random() * 6 - 2)
  trap.FlipX = 1
  trap.RotZ = 0
  return trap
}