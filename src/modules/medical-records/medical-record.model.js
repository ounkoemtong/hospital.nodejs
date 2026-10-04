import db from '../../config/db.js';

export const MedicalRecordModel = {
  // 🔍 យកទិន្នន័យ Medical Records ទាំងអស់ (សម្រាប់ Doctor/Admin)
  async getAll() {
    const [rows] = await db.query(`
      SELECT mr.*, p.name as patient_name, u.name as doctor_name 
      FROM medical_records mr
      LEFT JOIN patients p ON mr.patient_id = p.id
      LEFT JOIN users u ON mr.doctor_id = u.id
    `);
    return rows;
  },

  // 🔍 ស្វែងរកតាម ID
  async getById(id) {
    const [rows] = await db.query(`
      SELECT mr.*, p.name as patient_name, u.name as doctor_name 
      FROM medical_records mr
      LEFT JOIN patients p ON mr.patient_id = p.id
      LEFT JOIN users u ON mr.doctor_id = u.id
      WHERE mr.id = ?
    `, [id]);
    return rows[0];
  },

  // 👤 ស្វែងរកប្រវត្តិវេជ្ជសាស្ត្រតាម Patient ID (សម្រាប់ Patient Portal)
  async getByPatientId(patientId) {
    const [rows] = await db.query(`
      SELECT mr.*, u.name as doctor_name 
      FROM medical_records mr
      LEFT JOIN users u ON mr.doctor_id = u.id
      WHERE mr.patient_id = ?
    `, [patientId]);
    return rows;
  },

  // ➕ បង្កើត Record ថ្មី
  async create(data) {
    const { patient_id, doctor_id, diagnosis, treatment, prescriptions, notes } = data;
    const [result] = await db.query(`
      INSERT INTO medical_records (patient_id, doctor_id, diagnosis, treatment, prescriptions, notes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [patient_id, doctor_id, diagnosis, treatment, prescriptions, notes]);
    return result.insertId;
  },

  // ✏️ កែប្រែ Record
  async update(id, data) {
    const { diagnosis, treatment, prescriptions, notes } = data;
    await db.query(`
      UPDATE medical_records 
      SET diagnosis = ?, treatment = ?, prescriptions = ?, notes = ? 
      WHERE id = ?
    `, [diagnosis, treatment, prescriptions, notes, id]);
  },

  // 🗑️ លុប Record
  async delete(id) {
    await db.query(`DELETE FROM medical_records WHERE id = ?`, [id]);
  }
};