import * as admin from 'firebase-admin'

export const logData = {
  TimeStampLastActivity: admin.firestore.Timestamp.now(),
  AdsPlayed: 0,
  TotalInGameMoneyAcquired: 0,
  TotalCrystalsAcquired: 0
}