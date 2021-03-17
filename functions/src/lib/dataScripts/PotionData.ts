export const potionData = {
  HowManyPotionsOfAType: initPotions(),
}

function initPotions () {
  let potions: { [key: string]: any } = {}
  for (let i = 1; i <= 7; i++) {
    potions["Potion0" + i.toString()] = 0
  }
  return potions
}