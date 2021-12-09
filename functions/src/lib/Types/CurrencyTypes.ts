import * as admin from 'firebase-admin'

export type allPotionsType = {
    [key: number]: number
  }

export type manaType = {
    CurrentMana: number
    MaxMana: number
    ManaPerMinute: number
    LastManaUpdate: admin.firestore.Timestamp
  }