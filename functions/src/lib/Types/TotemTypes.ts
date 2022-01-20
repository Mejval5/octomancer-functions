import * as admin from 'firebase-admin'

export type totemType = {
    RitualRunning: boolean
    RitualEnd: admin.firestore.Timestamp
    RitualStart: admin.firestore.Timestamp
    DurabilityLeft: number
    BonusSlots: bonusSigilSlotsType
    NormalSlots: sigilSlotsType
    RitualSlot: nullableSigilType
    RitualFinishedPackage: nullableSigilType
    RitualTask: string
    FinishedRituals: sigilSlotsType
}

export type sigilSlotsType = {
    [key: number]: nullableSigilType
}

export type sigilType = {
    Value: number
    Type: number
    Name: string
}
  
export type bonusSigilSlotsType = {
    [key: number]: bonusSlotType
}  

export type bonusSlotType = {
    Sigil: nullableSigilType
    Unlocked: boolean
}

export type nullableSigilType = sigilType | null
