const express = require('express')
const next = require('next')
const fs = require('fs')
const path = require('path')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const api = require('./api')

app.prepare().then(() => {
  const server = express()

  server.get(['/', '/_next*'], (req, res) => {
    return handle(req, res)
  })

  server.get('/api/test', (_, res) => {
    fs.stat(path.join(__dirname, 'data', 'shorty.db'), (err) => {
      res.send({ok: 1, err})
    })
  })

  server.use(api)

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
