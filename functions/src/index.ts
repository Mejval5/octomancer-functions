import * as admin from 'firebase-admin'
admin.initializeApp()


// Get stuff from the database
import {_getCurrentTime} from './lib/GetDataScripts/GetCurrentTime'
import {_getPlayerDataJson} from './lib/GetDataScripts/GetPlayerDataJson'
import {_getPlayerListByRank} from './lib/GetDataScripts/GetPlayerListByRank'
import {_getAttackTargetsJson} from './lib/GetDataScripts/GetAttackTargetsJson'
import {_getDatasheets} from './lib/GetDataScripts/GetDatasheets'

exports.getPlayerDataJson = _getPlayerDataJson
exports.getCurrentTime = _getCurrentTime
exports.getPlayerListByRank = _getPlayerListByRank
exports.getAttackTargetsJson = _getAttackTargetsJson
exports.getDatasheets = _getDatasheets


// Totem functions
import {_uploadSigilPositionChange} from './lib/Totem/UploadSigilPositionChange'
import {_addNewSigilToTotem} from './lib/Totem/AddNewSigilToTotem'
import {_startRitual} from './lib/Totem/StartRitual'
import {_cancelRitual} from './lib/Totem/CancelRitual'
import {_attemptFinishingRitual} from './lib/Totem/AttemptFinishingRitual'
import {_sellSigil} from './lib/Totem/SellSigil'
import { _mergeSigils } from './lib/Totem/MergeSigils'

exports.uploadSigilPositionChange = _uploadSigilPositionChange
exports.addNewSigilToTotem = _addNewSigilToTotem
exports.startRitual = _startRitual
exports.cancelRitual = _cancelRitual
exports.attemptFinishingRitual = _attemptFinishingRitual
exports.sellSigil = _sellSigil
exports.mergeSigils = _mergeSigils


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
import {_createCurrencyCostsDatasheet} from './lib/Datasheets/CreateCurrencyCostsDatasheet'

exports.createAttackRewardsDatasheet = _createAttackRewardsDatasheet
exports.createCurrencyCostsDatasheet = _createCurrencyCostsDatasheet

// Attacking functions
import {_finishAttack} from './lib/AttackMode/FinishAttack'
import {_finishAttackSpins} from './lib/AttackMode/FinishAttackSpins'
import {_skipDungeon} from './lib/AttackMode/SkipDungeon'
import {_subtractManaAttack} from './lib/AttackMode/SubtractManaAttack'

exports.finishAttack = _finishAttack
exports.finishAttackSpins = _finishAttackSpins
exports.skipDungeon = _skipDungeon
exports.subtractManaAttack = _subtractManaAttack

// Updating functions
import { _updateMana } from './lib/GameLogic/Currencies/ManaUpdater'
import {_updateAllPlayers} from './lib/CreateDataScripts/UpdateScripts/PlayerUpdater'
import { _updateXP } from './lib/GameLogic/Currencies/XPUpdater'

exports.updateMana = _updateMana
exports.updateAllPlayers = _updateAllPlayers
exports.updateXP = _updateXP