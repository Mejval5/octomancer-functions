import * as admin from 'firebase-admin'

export type allItemsType = {
    PortalDefenseUpgrade: itemType
    PearlMineMaxUpgrade: itemType
    ManaMaxUpgrade: itemType
    ManaRegenUpgrade: itemType
    PearlMineSpeedUpgrade: itemType
    SkullPriceUpgrade: itemType
    SigilDefenseUpgrade: itemType
    MerchantUpgrade: itemType
    HealthSaverUpgrade: itemType
    ManaSaverUpgrade: itemType
    RitualSpeedUpgrade: itemType
}

export type itemType = {
  ItemLevel: number
  UpgradingBool: boolean
  TimeStampFinishedUpgrading: admin.firestore.Timestamp
}