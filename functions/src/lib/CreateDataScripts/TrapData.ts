import * as admin from 'firebase-admin'
import { trapItemType } from "../Types/TrapTypes"


export const newTrapItemData: trapItemType = {  
  TrapLevel: 1,
  UpgradingBool: false,
  TimeStampFinishedUpgrading: admin.firestore.Timestamp.now()
}