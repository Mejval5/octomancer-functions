import { numberNumberMapType } from "./GeneralTypes"

export type starDatasheetType = {
    PearlsMult: number
    XPMult: number
    SigilChance: number
}

export type starsDatasheetType = {
    [key: number]: starDatasheetType
}

export type attackRewardsDatasheetType = {
    RewardsByStars: starsDatasheetType
    BaseXP: number
}

export type currencyCostsDatasheetType = {
    SpinAgain: spinAgainDatasheetType
    SpinAgainCumulative: spinAgainDatasheetType
    SkipCost: number
}

export type spinAgainDatasheetType = {
    [key: number]: number
}

export type itemDatasheetType = {
    PortalDefenseUpgrade: numberNumberMapType
    PortalDefenseUpgradeManaCost: numberNumberMapType
}

export type totemDatasheetType = {
    BonusSlots: number
    RegularSlots: number
    RitualLengthPerSigilValue: numberNumberMapType
    TotemSigilMultiply: number
}

export type conversionsDatasheetType = {
    SigilValueToPearls: number
}