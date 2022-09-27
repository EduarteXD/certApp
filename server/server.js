const express = require('express')
const http = require('http')
const { spawn } = require('child_process')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)
const env = require('dotenv')
const pty = require('node-pty')
const io = new Server(server, {
    cors: true
})

env.config()

app.get('/', (req, res) => {
    res.json({ ok: true })
})

io.on('connection', (socket) => {
    socket.emit('msg', 'conn established')

    socket.on('exec', data => {
        execute(data, socket)
    })
})

server.listen(process.env.SERVER_PORT || 1333, () => {
    console.log(`server is running at *:${process.env.SERVER_PORT || 1333}`)
})

const execute = (data, socket) => {
    const domain = data.domain
    const mode = data.mode
    const issueCert = `~/.acme.sh/acme.sh --issue --server google --dns -d ${domain} -d *.${domain} --yes-I-know-dns-manual-mode-enough-go-ahead-please --keylength ec-256`
    const renewCert = `~/.acme.sh/acme.sh --renew --server google -d ${domain} --yes-I-know-dns-manual-mode-enough-go-ahead-please --ecc`

    const process = pty.spawn('sh', ['-c', (mode === 'issue' ? issueCert : renewCert)], {
        name: 'xterm-color',
        cols: 80,
        rows: 24
    })

    let buffer = ''
    let newLine = '\r\n'
    // let rewrite = '\r'

    /*
    process.on('data', data => {
        buffer += data
        if (buffer.slice(-newLine.length) === newLine) {
            let toSend = buffer.replace('\n', '').split('\r')
            toSend.forEach(val => {
                socket.emit('stdout', { data: val })
            })
            // socket.emit('stdout', { data: buffer })
            buffer = ''
        }
    })
    */

    process.onData(data => {
        buffer += data
        if (buffer.slice(-newLine.length) === newLine) {
            let toSend = buffer.replace('\n', '').split('\r')
            toSend.forEach(val => {
                socket.emit('stdout', { data: val })
            })
            // socket.emit('stdout', { data: buffer })
            buffer = ''
        }
    })

    process.onExit(code => {
        socket.emit('processexit', { code: code })
    })
}