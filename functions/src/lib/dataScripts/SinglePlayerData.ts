export const singlePlayerData = {
  HowManyStarsYouHaveForEachLevel: initStars(),
  AreTotemsAvailableInLevels: initTotems(),
}

function initStars () {
  let stars: { [key: string]: any } = {}
  for (let i = 0; i < 100; i++) {
    stars[i.toString()] = 0
  }
  return stars
}

function initTotems () {
  let totems: { [key: string]: any } = {}
  for (let i = 0; i < 100; i++) {
    totems[i.toString()] = true
  }
  return totems
}