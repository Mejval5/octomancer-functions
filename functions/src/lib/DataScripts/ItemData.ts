import * as admin from 'firebase-admin'
import { itemType } from '../Types/ItemTypes'

export const newItemData: itemType = {
  ItemLevel: 1,
  UpgradingBool: false,
  TimeStampFinishedUpgrading: admin.firestore.Timestamp.now()
}