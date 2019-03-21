function insertURL (db, urlObj) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO urls (
        original,
        shortened,
        created_at
      ) VALUES (
        $original,
        $shortened,
        $at
      )
    `, {
      $original: urlObj.original,
      $shortened: urlObj.shortened,
      $at: (new Date()).toISOString()
    }, function (err) {
      if (err) return reject(err)
      if (!this.lastID) return reject(new Error('Failed to insert url'))
      db.get('SELECT * FROM urls WHERE id = $id', {$id: this.lastID}, (err, row) => {
        if (err) return reject(err)
        resolve(row)
      })
    })
  })
}

function getURL (db, urlShort) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM urls WHERE shortened = $short', {
      $short: urlShort
    }, (err, url) => {
      if (err) return reject(err)
      resolve(url)
    })
  })
}

function validateURL(db, urlShort) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM urls U WHERE shortened = $short', {
      $short: urlShort
    }, (err, url) => {
      if (err) return reject(err)
      resolve(!url)
    })
  })
}

function deleteURL (db, urlId) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE urls SET active = 0, deleted_at = $at WHERE id = $urlId', {
      $urlId: urlId,
      $at: (new Date()).toISOString()
    }, function (err) {
      if (err) return reject(err)
      db.get('SELECT * FROM urls WHERE id = $id', {$id: urlId}, (err, row) => {
        if (err) return reject(err)
        resolve(row)
      })
    })
  })
}

function getURLs (db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT U.*, COUNT(U.id) as visits
      FROM urls U
      LEFT OUTER JOIN visits V ON V.url_id = U.id
      WHERE secret = 0 AND active = 1
      GROUP BY U.id
      ORDER BY U.id DESC`
    , (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

function insertVisit (db, urlId, referrer) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO visits (url_id, referrer, visited_at) VALUES (
        $urlId,
        $referrer,
        $at
      )
    `, {
      $urlId: urlId,
      $referrer: referrer,
      $at: (new Date()).toISOString()
    }, function (err) {
      if (err) return reject(err)
      if (!this.lastID) return reject(new Error('Failed to insert visit'))
      db.get('SELECT * FROM visits WHERE id = $id', {$id: this.lastID}, (err, row) => {
        if (err) return reject(err)
        resolve(row)
      })
    })
  })
}

module.exports = {
  url: {
    get: getURL,
    getall: getURLs,
    insert: insertURL,
    delete: deleteURL,
    validate: validateURL
  },
  visit: {
    insert: insertVisit
  }
}
