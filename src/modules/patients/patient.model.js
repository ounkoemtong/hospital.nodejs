// src/modules/patients/patient.model.js
import db from '../../config/db.js';

export const PatientModel = {
  // យកទិន្នន័យអ្នកជំងឺទាំងអស់
  async findAll() {
    const [rows] = await db.query('SELECT * FROM patients');
    return rows;
  },

  // បញ្ចូលអ្នកជំងឺថ្មី
  async create(patientData) {
    const { name, age, gender, phone } = patientData;
    const [result] = await db.query(
      'INSERT INTO patients (name, age, gender, phone) VALUES (?, ?, ?, ?)',
      [name, age, gender, phone]
    );
    return { id: result.insertId, ...patientData };
  },

  // ៣. មុខងារ Update (កែប្រែព័ត៌មានអ្នកជំងឺតាម ID)
  async update(id, patientData) {
    const { name, age, gender, phone } = patientData;
    await db.query(
      'UPDATE patients SET name = ?, age = ?, gender = ?, phone = ? WHERE id = ?',
      [name, age, gender, phone, id]
    );
    return { id, ...patientData };
  },

  // ៤. មុខងារ Delete (លុបអ្នកជំងឺតាម ID)
  async delete(id) {
    const [result] = await db.query('DELETE FROM patients WHERE id = ?', [id]);
    return result.affectedRows; // បង្ហាញចំនួនแถวที่ត្រូវបានលុប
  }
};