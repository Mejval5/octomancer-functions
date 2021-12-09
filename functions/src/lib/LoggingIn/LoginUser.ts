import * as functions from 'firebase-functions'
import { GetPlayerByAuthToken } from '../HelperMethods/GoogleMethods'

export const _loginUser = functions.https.onCall(async (_data) => {

    const authToken = _data.authToken
    
    const playerData = await GetPlayerByAuthToken(authToken)

    if (playerData === null) {
        return { success: false, message: 'user not in database' }
    }

    return { success: true, userName: playerData.PlayerName, message: 'user found: ' + playerData.PlayerName }
})