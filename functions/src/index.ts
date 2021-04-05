import * as admin from 'firebase-admin'
admin.initializeApp()


// Get stuff from the database
import {_getCurrentTime} from './lib/GetData/GetCurrentTime'
import {_getPlayerDataJson} from './lib/GetData/GetPlayerDataJson'
import {_getPlayerListByRank} from './lib/GetData/GetPlayerListByRank'
import {_getAttackTargetsJson} from './lib/GetData/GetAttackTargetsJson'
import {_getDatasheets} from './lib/GetData/GetDatasheets'

exports.getPlayerDataJson = _getPlayerDataJson
exports.getCurrentTime = _getCurrentTime
exports.getPlayerListByRank = _getPlayerListByRank
exports.getAttackTargetsJson = _getAttackTargetsJson
exports.getDatasheets = _getDatasheets


// Totem functions
import {_playerGemScoreUpdate} from './lib/Totem/PlayerGemScoreUpdater'
import {_uploadGemPositionChange} from './lib/Totem/UploadGemPositionChange'
import {_addNewGemToTotem} from './lib/Totem/AddNewGemToTotem'
import {_startRitual} from './lib/Totem/StartRitual'
import {_cancelRitual} from './lib/Totem/CancelRitual'
import {_attemptFinishingRitual} from './lib/Totem/AttemptFinishingRitual'
import {_sellGem} from './lib/Totem/SellGem'

exports.playerGemScoreUpdate = _playerGemScoreUpdate
exports.uploadGemPositionChange = _uploadGemPositionChange
exports.addNewGem = _addNewGemToTotem
exports.startRitual = _startRitual
exports.cancelRitual = _cancelRitual
exports.attemptFinishingRitual = _attemptFinishingRitual
exports.sellGem = _sellGem


// Loging in and adding user functions
import {_setUsername} from './lib/LoggingIn/SetUsername'
import {_loginUser} from './lib/LoggingIn/LoginUser'
import {_addNewPlayer} from './lib/LoggingIn/AddNewPlayer'

exports.setUsername = _setUsername
exports.loginUser = _loginUser
exports.addNewPlayer = _addNewPlayer


// Level functions
import {_uploadLevelData} from './lib/UploadData/UploadLevelData'
import {_uploadBotLevelData} from './lib/UploadData/UploadBotLevelData'

exports.uploadLevelData = _uploadLevelData
exports.uploadBotLevelData = _uploadBotLevelData


// Datasheet functions
import {_createAttackRewardsDatasheet} from './lib/Datasheets/CreateAttackRewardsDatasheet'
import {_createCrystalCostsDatasheet} from './lib/Datasheets/CreateCrystalCostsDatasheet'

exports.createAttackRewardsDatasheet = _createAttackRewardsDatasheet
exports.createCrystalCostsDatasheet = _createCrystalCostsDatasheet

// Attacking functions
import {_removeAttackTargetAfterTime} from './lib/AttackMode/RemoveAttackTargetAfterTime'
import {_removeAttackTarget} from './lib/AttackMode/RemoveAttackTarget'
import {_finishAttack} from './lib/AttackMode/FinishAttack'
import {_finishAttackRolls} from './lib/AttackMode/FinishAttackRolls'
import {_skipDungeon} from './lib/AttackMode/SkipDungeon'

exports.removeAttackTargetAfterTime = _removeAttackTargetAfterTime
exports.removeAttackTarget = _removeAttackTarget
exports.finishAttack = _finishAttack
exports.finishAttackRolls = _finishAttackRolls
exports.skipDungeon = _skipDungeon