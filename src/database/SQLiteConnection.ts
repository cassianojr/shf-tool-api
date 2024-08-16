import { Database } from "sqlite3";

const DATABASE_PATH = "src/database/schedules.sqlite"

const db = new Database(DATABASE_PATH);

export default db;