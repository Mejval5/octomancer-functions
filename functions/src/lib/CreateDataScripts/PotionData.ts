import { allPotionsType } from "../Types/CurrencyTypes"

export function newPotions () {
  const potions: allPotionsType = {} as allPotionsType
  for (let i = 1; i <= 7; i++) {
    potions[i] = 0
  }
  return potions
}