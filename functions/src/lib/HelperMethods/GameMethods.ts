import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator'
import { spinsEnemyType } from '../Types/AttackTypes'

const configAdjectives: Config = {
  dictionaries: [colors, animals],
  style: 'capital',
  separator: ' '
}
const configColors: Config = {
  dictionaries: [adjectives, animals],
  style: 'capital',
  separator: ' '
}

export function RandomBotName () {
  let name = "Steve"
  if (Math.random() > 0.5) {
    name = uniqueNamesGenerator(configColors)
  } else {
    name = uniqueNamesGenerator(configAdjectives)
  }
  return addNumberAfterName(name)
}

export function addNumberAfterName(name: string) {
  return name + "#" + (Math.floor(Math.random()*90000) + 10000).toString();
}

export function GetSpins() {
    const spins: spinsEnemyType = {} as spinsEnemyType
    for (let i = 0; i < 20; i++) {
      spins[i] = Math.random()
    }
    return spins
}


export function GetRandomInt(min: number, max: number) {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min) + _min); //The maximum is exclusive and the minimum is inclusive
}