export default class Fetcher {
  constructor(basePath) {
    this.basePath = basePath
  }

  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    }
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }

  static parseJson(response) {
    return response.json()
  }

  get(path, headers) {
    return this.makeRequest('GET', path, headers)
  }

  post(path, headers, body) {
    return this.makeRequest('POST', path, headers, body)
  }

  makeRequest(method, path, headers, body) {
    const url = `${this.basePath}${path}`
    const data = { method, headers }
    if (body) {
      data.body = JSON.stringify(body)
    }
    if (method !== 'GET') {
      data.credentials = 'same-origin'
    }
    return fetch(url, data).then(Fetcher.checkStatus).
      then(Fetcher.parseJson)
  }
}
