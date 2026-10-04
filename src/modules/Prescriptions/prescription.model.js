// src/modules/prescriptions/prescription.model.js
import db from '../../config/db.js';

export const PrescriptionModel = {
  // Get All Data 
  async findAll() {
    const [rows] = await db.query(`
      SELECT prescriptions.*, 
             patients.name as patient_name, patients.phone as patient_phone,
             users.name as doctor_name, doctors.specialization as doctor_spec
      FROM prescriptions
      JOIN patients ON prescriptions.patient_id = patients.id
      JOIN doctors ON prescriptions.doctor_id = doctors.id
      JOIN users ON doctors.user_id = users.id
    `);
    return rows;
  },

  // Find prescription by id 
  async findById(id) {
    const [prescriptions] = await db.query(`
      SELECT prescriptions.*, 
             patients.name as patient_name, patients.phone as patient_phone, patients.allergies,
             users.name as doctor_name, doctors.specialization as doctor_spec
      FROM prescriptions
      JOIN patients ON prescriptions.patient_id = patients.id
      JOIN doctors ON prescriptions.doctor_id = doctors.id
      JOIN users ON doctors.user_id = users.id
      WHERE prescriptions.id = ?
    `, [id]);

    if (prescriptions.length === 0) return null;

    const prescription = prescriptions[0];

    
    const [items] = await db.query(`
      SELECT prescription_items.*, medicines.name as medicine_name, medicines.generic_name
      FROM prescription_items
      JOIN medicines ON prescription_items.medicine_id = medicines.id
      WHERE prescription_items.prescription_id = ?
    `, [id]);

    prescription.items = items;
    return prescription;
  },

  //  Create 
  async create(data) {
    const { appointment_id, patient_id, doctor_id, diagnosis, instructions } = data;
    const [result] = await db.query(
      'INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, instructions) VALUES (?, ?, ?, ?, ?)',
      [appointment_id, patient_id, doctor_id, diagnosis, instructions]
    );
    return { id: result.insertId, ...data };
  },

  // Update
  async update(id, data) {
    const { diagnosis, instructions } = data;
    await db.query(
      'UPDATE prescriptions SET diagnosis = ?, instructions = ? WHERE id = ?',
      [diagnosis, instructions, id]
    );
    return { id, ...data };
  },

  // Delete 
  async delete(id) {
    const [result] = await db.query('DELETE FROM prescriptions WHERE id = ?', [id]);
    return result.affectedRows;
  }
};