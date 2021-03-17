export const otherCrystalCurrencies = {
  HowManyCrystalsOfATypeHas: initCrystals(),
}

function initCrystals () {
  let crystals: { [key: string]: any } = {}
  for (let i = 1; i <= 7; i++) {
    crystals["Crystal0" + i.toString()] = 0
  }
  return crystals
}