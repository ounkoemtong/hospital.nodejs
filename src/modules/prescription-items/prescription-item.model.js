// src/modules/prescription-items/prescription-item.model.js
import db from '../../config/db.js';

export const PrescriptionItemModel = {
 
  async findByPrescriptionId(prescriptionId) {
    const [rows] = await db.query(`
      SELECT prescription_items.*, 
             medicines.name as medicine_name, 
             medicines.generic_name, 
             medicines.unit_price,
             medicines.stock_quantity
      FROM prescription_items
      JOIN medicines ON prescription_items.medicine_id = medicines.id
      WHERE prescription_items.prescription_id = ?
    `, [prescriptionId]);
    return rows;
  },
  async findAll() {
    const [rows] = await db.query(`
      SELECT prescription_items.*, 
             medicines.name as medicine_name, 
             medicines.generic_name, 
             medicines.unit_price
      FROM prescription_items
      JOIN medicines ON prescription_items.medicine_id = medicines.id
    `);
    return rows;
  },


  async create(data) {
    const { prescription_id, medicine_id, dosage, duration_days, quantity_prescribed } = data;
    
    const [result] = await db.query(
      `INSERT INTO prescription_items 
       (prescription_id, medicine_id, dosage, duration_days, quantity_prescribed) 
       VALUES (?, ?, ?, ?, ?)`,
      [prescription_id, medicine_id, dosage, duration_days, quantity_prescribed]
    );

    return { id: result.insertId, ...data };
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM prescription_items WHERE id = ?', [id]);
    return result.affectedRows;
  }
};