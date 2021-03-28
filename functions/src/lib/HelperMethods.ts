import * as admin from 'firebase-admin'

const { CloudTasksClient } = require('@google-cloud/tasks')
const {PubSub} = require('@google-cloud/pubsub');

const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId
const location = 'europe-west1'
const email = "cloudtasksenqueuer@test-bf862.iam.gserviceaccount.com"


export function GetRandomDocumentID () {
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const charAmount = 20
    let myString = ""
    for (let i = 0; i < charAmount; i++) {
        myString += glyphs[Math.round(Math.random() * (glyphs.length - 1))]
    }
    return myString
}

export async function StartTaskInQueue (queue: string, functionName: string, jsonPayload: any, runAtEpochSeconds: number) {
    const tasksClient = new CloudTasksClient()
    const queuePath: string = tasksClient.queuePath(project, location, queue)
    const url = `https://us-central1-test-bf862.cloudfunctions.net/${functionName}`
    const task = {
        httpRequest: {
          httpMethod: "POST",
          url,
          oidcToken: {
            serviceAccountEmail: email
          },
          body: Buffer.from(JSON.stringify(jsonPayload)).toString('base64'),
          headers: {
            'Content-Type': 'application/json'
          }
        },
        scheduleTime: {
          seconds: runAtEpochSeconds
        }
    }
    const [ response ] = await tasksClient.createTask({ parent: queuePath, task })
    return response.name
}

export async function SendPubSubMessage (topicName: string, data: any) {
    const pubSubClient = new PubSub();
    const dataBuffer: Buffer = Buffer.from(JSON.stringify(data));
    return pubSubClient.topic(topicName).publish(dataBuffer);
}

export async function GetPlayerByAuthToken(authToken : string) {
  const snapshot = await admin.firestore().collection('Players').where('AuthToken', '==', authToken).get()
  if (snapshot.empty) {
      return null
  }
  let playerData: FirebaseFirestore.DocumentData = {}
  snapshot.forEach(doc => {
      playerData = doc.data()
  })
  return playerData
}

export function GetDiceThrows() {
  const rolls: {[key: string]: {[key: string]: number}} = {}
  for (let i = 0; i < 20; i++) {
    const dice1 = rollDice(1, 6)
    const dice2 = rollDice(1, 6)
    rolls[i.toString()] = {"dice1": dice1, "dice2": dice2}
  }
  return rolls
}

function rollDice(min: number, max: number) {
  return min + Math.floor(Math.random() * (max-min + 1))
}