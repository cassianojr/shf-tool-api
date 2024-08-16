import { Database } from "sqlite3";

const DATABASE_PATH = "src/database/schedules.sqlite"

const db = new Database(DATABASE_PATH);

export const SQLiteSetup =  () =>{
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      endAt TEXT NOT NULL,
      ecosProjectId TEXT NOT NULL
    )`);
  });
}

export default db;