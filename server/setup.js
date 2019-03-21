module.exports = function setup (db) {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original TEXT NOT NULL,
        shortened TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        single_use INTEGER DEFAULT 0,
        secret INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        deleted_at TEXT
      )
    `)
    db.run(`
      CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url_id INTEGER NOT NULL,
        referrer TEXT,
        visited_at TEXT NOT NULL
      )
    `)
  })
}
