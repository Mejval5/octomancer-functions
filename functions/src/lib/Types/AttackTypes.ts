import * as admin from 'firebase-admin'
import { levelType } from './LevelTypes'
import { sigilType } from './TotemTypes'
import { allTrapItemsType } from './TrapTypes'

export type spinsEnemyType = {
    [key: number]: number
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
    Sigil: sigilType | null
}

export type attackTargetUnityType = {    
    AttackToken: string
    PortalsAmount: number
    CorrectPortal: number
    Pearls: number
    PortalCost: number
    PlayerName: string
    CurrentGuild: string
    CurrentPearls: number
    LevelData: levelType
    Sigil: sigilType | null
    TrapData: allTrapItemsType
}