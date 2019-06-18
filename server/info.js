const {readFileSync} = require('fs');
const {join} = require('path');
const router = require('express').Router()

const runDateTime = new Date();
const git = {};
try {
  const recentCommit = readFileSync(join(__dirname, 'git.info'), {
    encoding: 'utf8'
  }).split('\n').filter(Boolean).pop().match(/.+?\s(.+?)\s(.+?)\s\d+\s\+\d{4}\s\w+\:\s(.+)/)
  if (recentCommit && recentCommit.length > 3) {
    git.hash = recentCommit[1]
    git.author = recentCommit[2]
    git.commit = recentCommit[3]
  }
} catch (e) {
  console.error('/info', e.message)
}

router.get('/info', async (_, res) => {
  res.json({
    runDateTime,
    git
  })
})

module.exports = router
