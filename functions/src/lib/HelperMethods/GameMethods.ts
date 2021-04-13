import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator'

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

export function GetDiceThrows() {
    const rolls: {[key: string]: {[key: string]: number}} = {}
    for (let i = 0; i < 20; i++) {
      const dice1 = RollDice(1, 6)
      const dice2 = RollDice(1, 6)
      rolls[i.toString()] = {"dice1": dice1, "dice2": dice2}
    }
    return rolls
  }
  
export function RollDice(min: number, max: number) {
  return min + Math.floor(Math.random() * (max-min + 1))
}

  
export function RandomBotName () {
  let name = "Steve"
  if (Math.random() > 0.5) {
    name = uniqueNamesGenerator(configColors)
  } else {
    name = uniqueNamesGenerator(configAdjectives)
  }
  return name + "#" + Math.floor(Math.random() * 9000 + 1000).toString()
}