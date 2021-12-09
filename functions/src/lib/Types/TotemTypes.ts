import * as admin from 'firebase-admin'

export type totemType = {
    RitualRunning: boolean
    RitualEnd: admin.firestore.Timestamp
    RitualStart: admin.firestore.Timestamp
    DurabilityLeft: number
    BonusSlots: bonusSigilSlotsType
    NormalSlots: sigilSlotsType
    RitualSlot: sigilType | null
    RitualFinishedPackage: sigilType | null
    RitualTask: string
}

export type sigilSlotsType = {
    [key: number]: sigilType | null
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
    Sigil: sigilType | null
    Unlocked: boolean
}

  