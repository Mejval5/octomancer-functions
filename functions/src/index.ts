import * as admin from 'firebase-admin'
admin.initializeApp()


// Get stuff from the database
import {_getCurrentTime} from './lib/getData/GetCurrentTime'
import {_getPlayerDataJson} from './lib/getData/GetPlayerDataJson'
import {_getPlayerListByRank} from './lib/getData/GetPlayerListByRank'
import {_getAttackTargetsJson} from './lib/getData/GetAttackTargetsJson'
import {_getDatasheets} from './lib/getData/GetDatasheets'

exports.getPlayerDataJson = _getPlayerDataJson
exports.getCurrentTime = _getCurrentTime
exports.getPlayerListByRank = _getPlayerListByRank
exports.getAttackTargetsJson = _getAttackTargetsJson
exports.getDatasheets = _getDatasheets


// Totem functions
import {_playerGemScoreUpdate} from './lib/PlayerGemScoreUpdater'
import {_uploadGemPositionChange} from './lib/UploadGemPositionChange'
import {_addNewGemToTotem} from './lib/AddNewGemToTotem'
import {_startRitual} from './lib/StartRitual'
import {_cancelRitual} from './lib/CancelRitual'
import {_attemptFinishingRitual} from './lib/AttemptFinishingRitual'

exports.playerGemScoreUpdate = _playerGemScoreUpdate
exports.uploadGemPositionChange = _uploadGemPositionChange
exports.addNewGem = _addNewGemToTotem
exports.startRitual = _startRitual
exports.cancelRitual = _cancelRitual
exports.attemptFinishingRitual = _attemptFinishingRitual


// Loging in and adding user functions
import {_setUsername} from './lib/SetUsername'
import {_loginUser} from './lib/LoginUser'
import {_addNewPlayer} from './lib/AddNewPlayer'

exports.setUsername = _setUsername
exports.loginUser = _loginUser
exports.addNewPlayer = _addNewPlayer


// Level functions
import {_uploadLevelData} from './lib/UploadLevelData'

exports.uploadLevelData = _uploadLevelData


// Datasheet functions
import {_createAttackRewardsDatasheet} from './datasheets/CreateAttackRewardsDatasheet'

exports.createAttackRewardsDatasheet = _createAttackRewardsDatasheet

// Attacking functions
import {_removeAttackTargetAfterTime} from './lib/RemoveAttackTargetAfterTime'
import {_removeAttackTarget} from './lib/RemoveAttackTarget'

exports.removeAttackTargetAfterTime = _removeAttackTargetAfterTime
exports.removeAttackTarget = _removeAttackTarget