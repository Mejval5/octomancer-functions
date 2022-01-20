import * as admin from 'firebase-admin'
import { levelType } from './LevelTypes'
import { nullableSigilType} from './TotemTypes'
import { allTrapItemsType } from './TrapTypes'

export type spinsEnemyType = {
    [key: number]: number
}

export type botDataType = {
    Created: admin.firestore.Timestamp
    LevelData: levelType
}

export type attackTargetFirebaseType = {
    TargetName: string
    AttackToken: string
    Spins: spinsEnemyType
    Pearls: number
    PortalCost: number
    PortalsAmount: number
    CorrectPortal: number
    AddedTime: admin.firestore.Timestamp
    IsTargetBot: boolean
    AlreadyAttacked: boolean
    Stars: number
    RemoveTask: string
    Sigil: nullableSigilType
}

export type attackTargetUnityType = {    
    AttackToken: string
    PortalsAmount: number
    CorrectPortal: number
    Pearls: number
    PortalCost: number
    PlayerName: string
    CurrentGuild: string
    LevelData: levelType
    Sigil: nullableSigilType
    TrapData: allTrapItemsType
}