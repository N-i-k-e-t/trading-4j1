
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
    db = await SQLite.openDatabaseAsync('disciplineos.db');
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS trading_days (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT,
      date TEXT UNIQUE NOT NULL,
      market_phase TEXT,
      sleep_quality INTEGER,
      energy_level INTEGER,
      baseline_emotion TEXT,
      state_logged_at TEXT,
      discipline_score INTEGER,
      rules_locked BOOLEAN DEFAULT 0,
      day_completed BOOLEAN DEFAULT 0,
      reset_completed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS daily_rules (
      id TEXT PRIMARY KEY NOT NULL,
      day_id TEXT NOT NULL,
      daily_intention TEXT,
      max_trades INTEGER,
      fixed_quantity INTEGER,
      max_daily_loss REAL,
      rules_locked_at TEXT,
      created_at TEXT,
      FOREIGN KEY(day_id) REFERENCES trading_days(id)
    );
  `);
    console.log('Database initialized');
};

export const getDB = () => {
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return db;
};
