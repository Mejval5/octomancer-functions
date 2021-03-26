import * as admin from 'firebase-admin'
admin.initializeApp()

import {_playerGemScoreUpdate} from './lib/PlayerGemScoreUpdater'
import {_getCurrentTime} from './lib/GetCurrentTime'
import {_getPlayerDataJson} from './lib/GetPlayerDataJson'
import {_getPlayerListByRank} from './lib/GetPlayerListByRank'
import {_getAttackTargetsJson} from './lib/GetAttackTargetsJson'
import {_setUsername} from './lib/SetUsername'
import {_loginUser} from './lib/LoginUser'
import {_addNewPlayer} from './lib/AddNewPlayer'
import {_addNewGemToTotem} from './lib/AddNewGemToTotem'
import {_startRitual} from './lib/StartRitual'
import {_attemptFinishingRitual} from './lib/AttemptFinishingRitual'
import {_uploadLevelData} from './lib/UploadLevelData'
import {_uploadGemPositionChange} from './lib/UploadGemPositionChange'
import {_getDatasheets} from './lib/GetDatasheets'
import {_cancelRitual} from './lib/CancelRitual'


exports.playerGemScoreUpdate = _playerGemScoreUpdate

exports.getPlayerDataJson = _getPlayerDataJson

exports.getCurrentTime = _getCurrentTime

exports.getPlayerListByRank = _getPlayerListByRank

exports.getAttackTargetsJson = _getAttackTargetsJson

exports.setUsername = _setUsername

exports.loginUser = _loginUser

exports.addNewPlayer = _addNewPlayer

exports.addNewGem = _addNewGemToTotem

exports.startRitual = _startRitual

exports.attemptFinishingRitual = _attemptFinishingRitual

exports.uploadLevelData = _uploadLevelData

exports.uploadGemPositionChange = _uploadGemPositionChange

exports.getDatasheets = _getDatasheets

exports.cancelRitual = _cancelRitual