import * as admin from 'firebase-admin'

export const dailyRewardData = {
  LastRewardAcquired: admin.firestore.Timestamp.now(),
  CurrentStreakScore: 0
}