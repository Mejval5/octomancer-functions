import * as admin from 'firebase-admin'

export const itemData = {
  ItemLevel: 1,
  ItemExperience: 0,
  UpgradingBool: false,
  TimeStampFinishedUpgrading: admin.firestore.Timestamp.now(),
}