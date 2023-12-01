import https from 'https'

interface HTTPError {
    code: string,
    errno: number,
    hostname: string,
    syscall: string,
    message: string,
    stack: string
}

export function httpsGet(url: string,
    callback: (data: Buffer) => void,
    errorCallback?: (e: HTTPError) => void) {
    const req = https.request(url, res => res.on('data', callback))
    req.on('error', errorCallback ?? (e => console.error(e)))
    req.end()
}
export function httpsGetJSON(url: string,
    callback: (data: Object) => void,
    errorCallback?: (e: HTTPError) => void) {
    httpsGet(url, d => callback(JSON.parse(d.toString())), errorCallback)
}