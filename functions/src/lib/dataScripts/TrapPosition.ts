export const trapPosition = {
  Name: '',
  PosX: 0,
  PosY: 0,
  RotZ: 0,
  FlipX: 0
}

export function InitTrap (name: string) {
  const trap = Object.assign({}, trapPosition)
  trap.Name = name
  trap.PosX = Math.round(Math.random() * 6 - 3)
  trap.PosY = Math.round(Math.random() * 6 - 3)
  trap.FlipX = 1
  trap.RotZ = 0
  return trap
}