import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

db.prepare(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    style TEXT,
    priority TEXT,
    partner TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS ticket_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER,
    type TEXT,
    path TEXT,
    uploaded_by TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS available_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    path TEXT,
    name TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS partners (
    name TEXT,
    logo TEXT,
    api_endpoint TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    role TEXT DEFAULT 'operator'
  )  
`).run();

console.log(`✅ Database ready!`);

export default db;





