import * as admin from 'firebase-admin'

import {InitGem} from './Gem'
import {GetRandomDocumentID} from '../HelperMethods'

export const totemData = {
  RitualRunning: false,
  RitualEnd: admin.firestore.Timestamp.now(),
  RitualStart: admin.firestore.Timestamp.now(),
  DurabilityLeft: 3,
  BonusSlots: InitBonusSlots(),
  Gems: InitGems(),
  RitualFinishedPackage: {},
}

function InitGems () {
    let gems: { [key: string]: any } = {}
    for (let i = 0; i < 3; i++) {
      const _t = Math.round(Math.random() * 4)
      const _v = Math.round(Math.random() * 20 + 5)
      gems[GetRandomDocumentID()] = InitGem(_v, _t, i)
    }
    return gems
}

function InitBonusSlots () {
    let bonusSlots: { [key: string]: any } = {}
    for (let i = 0; i < 6; i++) {
      bonusSlots[i.toString()] = false
    }
    return bonusSlots
}