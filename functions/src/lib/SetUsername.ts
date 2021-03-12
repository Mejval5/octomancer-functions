import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

var Filter = require('bad-words');
var customFilter = new Filter({ placeHolder: 'x'});


export const _setUsername = functions.https.onCall(async (_data) => {
    let userName = _data.UserName
    let success = true
    let returnName = ''
    let returnMessage = ''
    let userNameWithHash = ''
    if (userName.length > 3) {
        if (!customFilter.isProfane(userName))
        {
        while (true)
            {
            userNameWithHash = userName + "#" + (Math.floor(Math.random()*90000) + 10000).toString();
        
            let player_document = await admin.firestore().collection('Players').doc(userNameWithHash).get()

            if (!player_document.exists) {
                break
            }

        }
        returnName = userNameWithHash
        } else {
            success = false
            returnMessage = 'profane'
        }

    } else {
        success = false
        returnMessage = 'too short'
    }
    return {'success': success, 'userName': returnName, 'returnMessage': returnMessage}
})