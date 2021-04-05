import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {AddNewPlayer} from './AddNewPlayer'

const Filter = require('bad-words');
const customFilter = new Filter({ placeHolder: 'x'});

export const _setUsername = functions.https.onCall(async (_data) => {
    const userName = _data.userName
    const authToken = _data.authToken
    let success = false
    let returnName = ''
    let message = ''
    let userNameWithHash = ''
    if (userName.length > 3) {
        if (!customFilter.isProfane(userName))
        {
        while (true)
            {
            userNameWithHash = userName + "#" + (Math.floor(Math.random()*90000) + 10000).toString();
        
            const player_document = await admin.firestore().collection('Players').doc(userNameWithHash).get()

            if (!player_document.exists) {
                break
            }

        }
        success = true
        message = "accepted"
        returnName = userNameWithHash
        await AddNewPlayer(userNameWithHash, authToken)
        } else {
            success = false
            message = 'This username contains swear words'
        }

    } else {
        success = false
        message = 'Username is too short!'
    }
    return {success: success, userName: returnName, message: message}
})