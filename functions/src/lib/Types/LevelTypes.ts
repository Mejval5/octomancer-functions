import { allTrapPositionsType } from './TrapTypes'

export type levelType = {
  Shape: number
  Style: number
  ChangedLayout: boolean
  TrapPositions: allTrapPositionsType
  EnterAndExitPositions: allTrapPositionsType
}
