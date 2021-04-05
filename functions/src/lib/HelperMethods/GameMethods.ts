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