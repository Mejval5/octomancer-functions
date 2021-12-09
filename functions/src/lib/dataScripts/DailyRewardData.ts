import * as admin from 'firebase-admin'
import { dailyRewardType } from '../Types/GameTypes'

export const newDailyRewardData: dailyRewardType = {
  LastRewardAcquired: admin.firestore.Timestamp.now(),
  CurrentStreakScore: 0
}