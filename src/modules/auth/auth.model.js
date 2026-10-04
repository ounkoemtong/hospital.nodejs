// src/modules/auth/auth.model.js
import db from '../../config/db.js';

export const AuthModel = {
  // find User by Email
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // create new user into Database
  async createUser(userData) {
    const { name, email, password, role_id } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, password, role_id || 7] 
    );
    return { id: result.insertId, name, email, role_id };
  }
};