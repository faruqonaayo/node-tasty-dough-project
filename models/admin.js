import { db } from "../util/dbConnect.js";

class Admin {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async createAdmin() {
    try {
      const response = await db.query(
        "INSERT INTO admin (username, password) VALUES ($1,$2) RETURNING *",
        [this.username, this.password]
      );
      const newAdmin = response.rows[0];
      return newAdmin;
    } catch (error) {
      // check this later
      console.log(error);
    }
  }
  static async checkForAdmin() {
    try {
      const response = await db.query("SELECT * FROM admin");
      if (response.rows.length !== 1) {
        return null;
      }
      return true;
    } catch (error) {
      // check this later
      console.log(error);
    }
  }
}

export default Admin;