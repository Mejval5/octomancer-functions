import { sigilType } from "../Types/TotemTypes"

export function InitSigil (_value: number, _type: number, _name: string) {
  const sigil: sigilType = {} as sigilType
  sigil.Value = _value
  sigil.Type = _type
  sigil.Name = _name
  return sigil
}