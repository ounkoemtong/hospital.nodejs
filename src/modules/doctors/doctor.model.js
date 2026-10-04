// src/modules/doctors/doctor.model.js
import db from '../../config/db.js';

export const DoctorModel = {
  async findAll() {
    const [rows] = await db.query(`
      SELECT doctors.*, users.name, users.email 
      FROM doctors 
      JOIN users ON doctors.user_id = users.id
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(`
      SELECT doctors.*, users.name, users.email 
      FROM doctors 
      JOIN users ON doctors.user_id = users.id 
      WHERE doctors.id = ?
    `, [id]);
    return rows[0];
  },

  async create(doctorData) {
    const { user_id, specialization, phone } = doctorData;

    const [result] = await db.query(
      'INSERT INTO doctors (user_id, specialization, phone) VALUES (?, ?, ?)',
      [user_id, specialization, phone]
    );

    return { 
      id: result.insertId, 
      user_id, 
      specialization, 
      phone 
    };
  },

  async update(id, doctorData) {
    const { specialization, phone } = doctorData;
    await db.query(
      'UPDATE doctors SET specialization = ?, phone = ? WHERE id = ?',
      [specialization, phone, id]
    );
    return { id, ...doctorData };
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM doctors WHERE id = ?', [id]);
    return result.affectedRows;
  }
};