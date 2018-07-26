import { trackerApi } from './config'

export function getMainInfo() {
    return new Promise((resolve, reject) => {
      trackerApi.get('/v0/main/mainInfo')
        .then(result => {
          resolve(result.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  
  export function getMainChart() {
    return new Promise((resolve, reject) => {
      trackerApi.get('/v0/main/mainChart')
        .then(result => {
          resolve(result.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  