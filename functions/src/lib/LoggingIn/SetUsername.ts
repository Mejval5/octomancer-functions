import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {AddNewPlayer} from './AddNewPlayer'
import { addNumberAfterName } from '../HelperMethods/GameMethods';

const Filter = require('bad-words');
const customFilter = new Filter({ placeHolder: 'x'});

export const _setUsername = functions.https.onCall(async (_data) => {
    const authToken = _data.authToken as string
    const userName = _data.userName as string

    let userNameWithNumber = ''

    if (userName === undefined) {
        return {success: false, message: "No username"}
    }

    if (userName.includes("#")) {
        return {success: false, message: "You cannot use # in name!"}
    }

    if (userName.length < 3) {
        return {success: false, message: "Username must be at least 3 characters!"}
    }

    if (customFilter.isProfane(userName)) {
        return {success: false, message: "This username contains swear words!"}
    }

    while (true)
        {
        userNameWithNumber = addNumberAfterName(userName)
    
        const player_document = await admin.firestore().collection('Players').doc(userNameWithNumber).get()

        if (!player_document.exists) {
            break
        }
    }

    await AddNewPlayer(userNameWithNumber, authToken)
    return {success: true, userName: userNameWithNumber, message: "Accepted name: " + userNameWithNumber}
})