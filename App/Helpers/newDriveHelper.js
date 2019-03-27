export default class DriveHelper {

  static url = 'https://www.googleapis.com/drive/v3'
  static uploadUrl = 'https://www.googleapis.com/upload/drive/v3'
  static boundaryString = '-------314159265358979323846264'

  static queryParams() {
    return encodeURIComponent("'appDataFolder' in parents")
  }

  static parseAndHandleErrors(response) {
    if (response.ok) {
      return response
    }
    return response.json()
      .then((error) => {
        throw new Error(JSON.stringify(error))
      })
  }


  static configureGetOptions(accessToken) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${accessToken}`)
    return {
      method: 'GET',
      headers,
    }
  }

  static getFileList(accessToken) {
    return new Promise((res, err) => {
      const qParams = this.queryParams()
      const options = this.configureGetOptions(accessToken)
      fetch(`${this.url}/files?q=${qParams}&spaces=appDataFolder`, options)
        .then(this.parseAndHandleErrors)
        .then((response) => {
          const files = JSON.parse(response._bodyInit).files
          res(files)
        }).catch((error) => err(error))
    })
  }

  static getFileById(accessToken, fileId) {
    return new Promise((res, err) => {
      const options = this.configureGetOptions(accessToken)
      fetch(`${this.url}/files/${fileId}?alt=media`, options)
        .then(this.parseAndHandleErrors)
        .then((response) => {
          res(response._bodyInit)
        }).catch((error) => err(error))
    })
  }
}