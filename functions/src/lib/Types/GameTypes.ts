import * as admin from 'firebase-admin'

export type dailyRewardType = {
    LastRewardAcquired: admin.firestore.Timestamp
    CurrentStreakScore: number
  }