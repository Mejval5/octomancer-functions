import {missionData} from './MissionData'

export function createMissionData () {
  let missions: { [key: string]: any } = {}
  for (let i = 0; i < 3; i++) {
    let mission = Object.assign({}, missionData)
    mission.Completion = 0
    mission.Finished = false
    mission.ID = i.toString()
    missions["Mission" + i.toString()] = mission
  }
  return missions
}