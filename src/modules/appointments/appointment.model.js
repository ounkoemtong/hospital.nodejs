// src/modules/appointments/appointment.model.js
import db from '../../config/db.js';

export const AppointmentModel = {
  async findAll() {
    const [rows] = await db.query(`
      SELECT appointments.*, 
             patients.name as patient_name, patients.phone as patient_phone,
             doctors.specialization as doctor_spec, users.name as doctor_name
      FROM appointments
      JOIN patients ON appointments.patient_id = patients.id
      JOIN doctors ON appointments.doctor_id = doctors.id
      JOIN users ON doctors.user_id = users.id
    `);
    return rows;
  },


  async findById(id) {
    const [rows] = await db.query(`
      SELECT appointments.*, 
             patients.name as patient_name, patients.phone as patient_phone,
             doctors.specialization as doctor_spec, users.name as doctor_name
      FROM appointments
      JOIN patients ON appointments.patient_id = patients.id
      JOIN doctors ON appointments.doctor_id = doctors.id
      JOIN users ON doctors.user_id = users.id
      WHERE appointments.id = ?
    `, [id]);
    return rows[0];
  },

 
  async create(data) {
    const { patient_id, doctor_id, appointment_date, status, reason } = data;
    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, status || 'PENDING', reason]
    );
    return { id: result.insertId, ...data };
  },


  async update(id, data) {
    const { patient_id, doctor_id, appointment_date, status, reason } = data;
    await db.query(
      'UPDATE appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, status = ?, reason = ? WHERE id = ?',
      [patient_id, doctor_id, appointment_date, status, reason, id]
    );
    return { id, ...data };
  },


  async delete(id) {
    const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [id]);
    return result.affectedRows;
  }
};