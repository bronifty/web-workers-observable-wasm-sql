import { PGlite } from "https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js";
import ObservableFactory from "https://esm.sh/@bronifty/marcs-observable@1.1.4";

export class UserModel {
  db;
  usersObservable;

  constructor() {
    this.db = new PGlite();
    this.usersObservable = ObservableFactory.create(0);
    this.setupDatabase();
  }

  async setupDatabase() {
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL
        );
      `);
      console.log("Database setup complete");
      await this.updateUserCount();
    } catch (error) {
      console.error("Error setting up database:", error);
    }
  }

  async addUser(name, email) {
    try {
      await this.db.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING;",
        [name, email]
      );
      await this.updateUserCount();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  async updateUserCount() {
    try {
      const result = await this.db.query(
        "SELECT COUNT(*) as count FROM users;"
      );
      console.log("Query result:", result);
      if (
        result &&
        result.rows &&
        result.rows.length > 0 &&
        "count" in result.rows[0]
      ) {
        this.usersObservable.value = Number(result.rows[0].count);
        console.log("Updated user count:", this.usersObservable.value);
      } else {
        console.error("Unexpected query result format:", result);
        this.usersObservable.value = 0;
      }
    } catch (error) {
      console.error("Error updating user count:", error);
      this.usersObservable.value = 0;
    }
  }
}
