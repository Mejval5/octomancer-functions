import * as admin from 'firebase-admin'

export const trapData = {
  TrapLevel: 1,
  TrapExperience: 0,
  UpgradingBool: false,
  TimeStampFinishedUpgrading: admin.firestore.Timestamp.now()
}