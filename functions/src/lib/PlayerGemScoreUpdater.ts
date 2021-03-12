import * as functions from 'firebase-functions'

export const _playerGemScoreUpdate = functions.firestore.document('Players/{userId}').onUpdate((change, context) =>{
    const after = change.after.data()
    let value = 0
    const gems = after.TotemGemData
    Object.keys(gems).forEach(function (key){
        value += gems[key].Value
    })
    if (after.GemScore === value) {
        return null
    }
    return change.after.ref.set({
        GemScore: value
      }, {merge: true})
})