import sqlite3 from 'sqlite3';
import path from 'path';

// Resolve database file path
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Initialize Database connection
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS consultation_requests (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        company_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        website TEXT,
        business_type TEXT NOT NULL,
        services_requested TEXT NOT NULL,
        project_description TEXT NOT NULL,
        budget_range TEXT NOT NULL,
        expected_budget TEXT,
        timeline TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'New Lead',
        created_at TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error creating consultation_requests table:', err.message);
      } else {
        console.log('SQLite consultation_requests table verified/created successfully.');
      }
    });
  });
}

export default db;
