import {InitTrap, InitStart, InitExit} from './TrapPosition'
import * as admin from 'firebase-admin'
import { allTrapPositionsType } from "../Types/TrapTypes";
import { botDataType } from '../Types/AttackTypes';

const _ = require('lodash');

export const newLevelData = {
  Shape: 0,
  Style: 0,
  ChangedLayout: false,
  TrapPositions: InitTraps(),
  EnterAndExitPositions: InitEnterAndExit()
}

function InitTraps () {
    const traps: allTrapPositionsType = {} as allTrapPositionsType
    traps[0] = InitTrap("Muscle")
    traps[1] = InitTrap("Piranha")
    traps[2] = InitTrap("Urchin")
    traps[3] = InitTrap("Dropper")
    traps[4] = InitTrap("StaticCanon")
    return traps
}

function InitEnterAndExit () {
    const traps: allTrapPositionsType = {} as allTrapPositionsType
    traps[0] = InitStart()
    traps[1] = InitExit()
    return traps
}

export async function GetRandomBotDungeon () {
  const botDocuments = (await admin.firestore().collection('Bots').get()).docs
  const shuffledData = _.shuffle(botDocuments)
  return ((shuffledData[0]).data() as botDataType).LevelData
}