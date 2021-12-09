import { numberNumberMapType } from "../Types/GeneralTypes"
import { singlePlayerType} from "../Types/SinglePlayerTypes"

export const newSinglePlayerData: singlePlayerType = {
  HowManyStarsYouHaveForEachLevel: newStars()
}

function newStars () {
  const stars: numberNumberMapType = {} as numberNumberMapType
  for (let i = 0; i < 100; i++) {
    stars[i] = 0
  }
  return stars
}