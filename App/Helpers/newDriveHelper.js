export default class DriveHelper {

    static url = 'https://www.googleapis.com/drive/v3'
    static uploadUrl = 'https://www.googleapis.com/upload/drive/v3'
    static boundaryString = '-------314159265358979323846264'

    // Looks for files with the specified file name in your app Data folder only (appDataFolder is a magic keyword)
    static queryParams() {
        return encodeURIComponent("'appDataFolder' in parents")
    }

    static parseAndHandleErrors(response) {
        if (response.ok) {
          return response.json()
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
        const qParams = this.queryParams()
        const options = this.configureGetOptions(accessToken)
        return fetch(`${this.url}/files?q=${qParams}&spaces=appDataFolder`, options)
            .then(this.parseAndHandleErrors)
            .then((body) => {
                return body
            })
    }
}