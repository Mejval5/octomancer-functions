import * as admin from 'firebase-admin'
import { manaType } from '../Types/CurrencyTypes'

export const newManaData: manaType = {
  CurrentMana: 100,
  MaxMana: 100,
  ManaPerMinute: 20,
  LastManaUpdate: admin.firestore.Timestamp.now()
}