export const singlePlayerData = {
  HowManyStarsYouHaveForEachLevel: initStars(),
  AreTotemsAvailableInLevels: initTotems()
}

function initStars () {
  const stars: { [key: string]: any } = {}
  for (let i = 0; i < 100; i++) {
    stars[i.toString()] = 0
  }
  return stars
}

function initTotems () {
  const totems: { [key: string]: any } = {}
  for (let i = 0; i < 100; i++) {
    totems[i.toString()] = true
  }
  return totems
}