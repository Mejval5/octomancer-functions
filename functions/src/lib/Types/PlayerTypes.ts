import * as admin from 'firebase-admin'
import { allItemsType } from "./ItemTypes"
import { allTrapItemsType } from "./TrapTypes"
import { levelType } from "./LevelTypes"
import { totemType } from "./TotemTypes"
import { dailyRewardType } from "./GameTypes"
import { allPotionsType, manaType } from "./CurrencyTypes"
import { singlePlayerType } from "./SinglePlayerTypes"

export type playerTypeFirebase = {    
    AuthToken: string
    Email: string
    PlayerName: string
    CurrentPearls: number
    TotalPearls: number
    CurrentLevel: number
    CurrentXP: number
    CurrentGems: number
    TotalGems: number
    CurrentLeague: string
    CurrentGuild: string
    ManaData: manaType
    SigilScore: number
    JoinDate: admin.firestore.Timestamp
    SinglePlayerData: singlePlayerType
    PotionData: allPotionsType
    DailyRewardData: dailyRewardType
    LevelData: levelType
    TotemData: totemType
    DefenseLog: any
    TrapData: allTrapItemsType
    ItemData: allItemsType
}

export type playerTypeUnity = {    
    AuthToken: string
    Email: string
    PlayerName: string
    CurrentPearls: number
    CurrentLevel: number
    CurrentXP: number
    CurrentGems: number
    CurrentLeague: string
    CurrentGuild: string
    ManaData: manaType
    SigilScore: number
    SinglePlayerData: singlePlayerType
    PotionData: allPotionsType
    DailyRewardData: dailyRewardType
    LevelData: levelType
    TotemData: totemType
    DefenseLog: any
    TrapData: allTrapItemsType
    ItemData: allItemsType
}

export type playerRankType = {    
    PlayerName: string
    SigilScore: number
}