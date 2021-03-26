export const gem = {
  Value: 0,
  Type: 0,
  Position: 0
}

export function InitGem (_value: number, _type: number, _position: number) {
  const _gem = Object.assign({}, gem)
  _gem.Value = _value
  _gem.Type = _type
  _gem.Position = _position
  return _gem
}