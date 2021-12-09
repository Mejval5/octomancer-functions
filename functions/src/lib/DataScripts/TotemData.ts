import * as admin from 'firebase-admin'

import {InitSigil} from './Sigil'
import {GetRandomDocumentID} from '../HelperMethods/GoogleMethods'
import {GetRandomInt} from '../HelperMethods/GameMethods'
import { bonusSigilSlotsType, bonusSlotType, sigilSlotsType, totemType } from '../Types/TotemTypes'
import { totemDatasheetType } from '../Types/DatasheetTypes'

export async function newTotem(): Promise<totemType> { 
  const totemDatasheetDoc = await admin.firestore().collection('Datasheets').doc('TotemDatasheet').get()
  const totemDatasheet = totemDatasheetDoc.data() as totemDatasheetType

  const totem = {} as totemType
  totem.RitualRunning = false
  totem.RitualEnd = admin.firestore.Timestamp.now()
  totem.RitualStart = admin.firestore.Timestamp.now()
  totem.DurabilityLeft = 3
  totem.BonusSlots = InitBonusSlots(totemDatasheet.BonusSlots)
  totem.NormalSlots = await GetNormalSlots(totemDatasheet.RegularSlots)
  totem.RitualSlot = null
  totem.RitualFinishedPackage = null
  totem.RitualTask = ""
  return totem
}

async function GetNormalSlots (slots: number) {
    const sigils: sigilSlotsType = {} as sigilSlotsType
    for (let i = 0; i < 3; i++) {
      const _t = GetRandomInt(0,2)
      const _v = Math.round(Math.random() * 20 + 5)
      sigils[i] = InitSigil(_v, _t, GetRandomDocumentID())
    }
    for (let i = 3; i < slots; i++) {
      sigils[i] = null
    }
    return sigils
}

function InitBonusSlots (slots: number) {
    const bonusSlots: bonusSigilSlotsType = {} as bonusSigilSlotsType
    for (let i = 0; i < slots; i++) {
      bonusSlots[i] = {} as bonusSlotType
      bonusSlots[i].Unlocked = false
      bonusSlots[i].Sigil = null
    }
    return bonusSlots
}