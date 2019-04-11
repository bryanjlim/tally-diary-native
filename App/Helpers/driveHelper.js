export default class DriveHelper {

  static url = 'https://www.googleapis.com/drive/v3'
  static uploadUrl = 'https://www.googleapis.com/upload/drive/v3'
  static boundaryString = '-------3141592653589793238462641'

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

  static configureDeleteOptions(accessToken) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${accessToken}`)
    return {
      method: 'DELETE',
      headers,
    }
  }

  static createMultipartBody(body, isUpdate, fileName) {
    // https://developers.google.com/drive/v3/web/multipart-upload defines the structure
    const metaData = {
      name: fileName,
      mimeType: 'application/json',
    }
    // if it already exists, specifying parents again throws an error
    if (!isUpdate) metaData.parents = ['appDataFolder']

    // request body
    const multipartBody = `\r\n--${this.boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`
      + `${JSON.stringify(metaData)}\r\n`
      + `--${this.boundaryString}\r\nContent-Type: application/json\r\n\r\n`
      + `${JSON.stringify(body)}\r\n`
      + `--${this.boundaryString}--`

    return multipartBody
  }


  static configurePostOptions(accessToken, bodyLength, isUpdate) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${accessToken}`)
    headers.append('Content-Type', `multipart/related; boundary=${this.boundaryString}`)
    headers.append('Content-Length', bodyLength)
    return {
      method: isUpdate ? 'PATCH' : 'POST',
      headers,
    }
  }

  static postFile(accessToken, content, fileName) {
    const body = this.createMultipartBody(content, false, fileName)
    const options = this.configurePostOptions(accessToken, body.length, false)
    return fetch(`${this.uploadUrl}/files?uploadType=multipart`, {
      ...options,
      body,
    })
      .then(this.parseAndHandleErrors)
  }

  static patchFile(accessToken, content, fileName, existingFileId) {
    const body = this.createMultipartBody(content, true, fileName)
    const options = this.configurePostOptions(accessToken, body.length, true)
    return fetch(`${this.uploadUrl}/files/${existingFileId}?uploadType=multipart`, {
      ...options,
      body,
    })
      .then(this.parseAndHandleErrors)
  }

  static getFileList(accessToken) {
    return new Promise((res, err) => {
      const qParams = this.queryParams()
      const options = this.configureGetOptions(accessToken)
      fetch(`${this.url}/files?q=${qParams}&spaces=appDataFolder`, options)
        .then(this.parseAndHandleErrors)
        .then((response) => {
          response.json().then((list) => {
            const files = list.files
            res(files)
          })
        }).catch((error) => err(error))
    })
  }

  static getFileById(accessToken, fileId) {
    return new Promise((res, err) => {
      const options = this.configureGetOptions(accessToken)
      fetch(`${this.url}/files/${fileId}?alt=media`, options)
        .then(this.parseAndHandleErrors)
        .then((response) => {
          res(response.json())
        }).catch((error) => err(error))
    })
  }

  static deleteFileById(accessToken, fileId) {
    const options = this.configureDeleteOptions(accessToken)
    fetch(`${this.url}/files/${fileId}`, options)
      .then(this.parseAndHandleErrors)
      .catch((error) => err(error))
  }
}