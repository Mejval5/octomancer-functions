import * as admin from 'firebase-admin'
admin.initializeApp()

import {_playerGemScoreUpdate} from './lib/PlayerGemScoreUpdater'
import {_getCurrentTime} from './lib/GetCurrentTime'
import {_getPlayerData} from './lib/GetPlayerData'
import {_getPlayerListByRank} from './lib/GetPlayerListByRank'
import {_getAttackTargets} from './lib/GetAttackTargets'
import {_setUsername} from './lib/SetUsername'
import {_loginUser} from './lib/LoginUser'
import {_addNewPlayer} from './lib/AddNewPlayer'
import {_addNewGemToTotem} from './lib/AddNewGemToTotem'


exports.playerGemScoreUpdate = _playerGemScoreUpdate

exports.getPlayerData = _getPlayerData

exports.getCurrentTime = _getCurrentTime

exports.getPlayerListByRank = _getPlayerListByRank

exports.getAttackTargets = _getAttackTargets

exports.setUsername = _setUsername

exports.loginUser = _loginUser

exports.addNewPlayer = _addNewPlayer

exports.addNewGem = _addNewGemToTotem