import * as admin from 'firebase-admin'
import {playerTypeFirebase} from './../Types/PlayerTypes'

const { CloudTasksClient } = require('@google-cloud/tasks')
const {PubSub} = require('@google-cloud/pubsub');

const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId
const location = 'europe-west1'
const email = "cloudtasksenqueuer@test-bf862.iam.gserviceaccount.com"


export function GetRandomDocumentID () : string {
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

export async function CancelTask (task: string) {
  const tasksClient = new CloudTasksClient()
  try {
    await tasksClient.deleteTask({ name: task })
  } catch {await Promise.resolve()}
}

export async function SendPubSubMessage (topicName: string, data: any) {
    const pubSubClient = new PubSub()
    const dataBuffer: Buffer = Buffer.from(JSON.stringify(data))
    return pubSubClient.topic(topicName).publish(dataBuffer)
}

export async function GetPlayerByAuthToken(authToken : string) : Promise<playerTypeFirebase | null> {
  const snapshot = await admin.firestore().collection('Players').where('AuthToken', '==', authToken).get()
  if (snapshot == null || snapshot.empty) {
      return null
  }
  let playerData: playerTypeFirebase = {} as playerTypeFirebase
  snapshot.forEach(doc => {
      playerData = doc.data() as playerTypeFirebase
  })
  return playerData
}

export async function GetPlayerByAuthTokenWithRef(authToken : string) : Promise<[playerTypeFirebase | null, FirebaseFirestore.DocumentReference | null]> {
  const snapshot = await admin.firestore().collection('Players').where('AuthToken', '==', authToken).get()
  if (snapshot == null || snapshot.empty) {
      return [null, null]
  }
  let playerData: playerTypeFirebase = {} as playerTypeFirebase
  let playerRef: FirebaseFirestore.DocumentReference | null = null
  snapshot.forEach(doc => {
      playerRef = doc.ref
      playerData = doc.data() as playerTypeFirebase
  })
  return [playerData, playerRef]
}