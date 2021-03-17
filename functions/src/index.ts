import * as admin from 'firebase-admin'
admin.initializeApp()

import {_playerGemScoreUpdate} from './lib/PlayerGemScoreUpdater'
import {_getCurrentTime} from './lib/GetCurrentTime'
import {_getPlayerListByRank} from './lib/GetPlayerListByRank'
import {_getAttackTargets} from './lib/GetAttackTargets'
import {_setUsername} from './lib/SetUsername'
import {_loginUser} from './lib/LoginUser'
import {_addNewPlayer} from './lib/AddNewPlayer'


export const playerGemScoreUpdate = _playerGemScoreUpdate

export const getCurrentTime = _getCurrentTime

export const getPlayerListByRank = _getPlayerListByRank

export const getAttackTargets = _getAttackTargets

export const setUsername = _setUsername

export const loginUser = _loginUser

exports.addNewPlayer = _addNewPlayer