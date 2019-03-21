const path = require('path')
const router = require('express').Router()
const bodyParser = require('body-parser')
const sqlite = require('sqlite3')
const setup = require('./setup')
const db = require('./db')
const {getShort} = require('./util')

const conn = new sqlite.Database(path.join(__dirname, '..', 'data', 'shorty.db'))
setup(conn)

router.use(bodyParser.json())

router.get('/api', async (_, res) => {
  const urls = await db.url.getall(conn)
  res.send(urls)
})

router.get('/:slug', async (req, res) => {
  const {slug} = req.params
  const referrer = req.headers.referrer || req.headers.referer
  const url = await db.url.get(conn, slug)
  if (!url) return res.redirect('/')
  await db.visit.insert(conn, url.id, referrer)
  res.redirect(url.original)
})

router.delete('/api/:id', async (req, res) => {
  const {id} = req.params;
  const url = await db.url.delete(conn, id)
  res.send(url)
})

router.post('/api', async (req, res) => {
  if (!req.body.original) {
    return res.status(400).send({err: 'Missing original url'})
  }
  let validShort;
  while (!validShort) {
    const potential = getShort()
    const valid = await db.url.validate(conn, potential)
    if (valid) validShort = potential
  }
  const url = await db.url.insert(conn, {
    original: req.body.original,
    shortened: validShort
  })
  res.send(url)
})

module.exports = router
