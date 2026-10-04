// src/modules/pharmacy/pharmacy.model.js
import db from '../../config/db.js';

export const PharmacyModel = {
  async findAll() {
    const [rows] = await db.query('SELECT * FROM medicines');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM medicines WHERE id = ?', [id]);
    return rows[0];
  },

  async create(medData) {
    const { name, generic_name, stock_quantity, unit_price, expiry_date } = medData;
    const [result] = await db.query(
      'INSERT INTO medicines (name, generic_name, stock_quantity, unit_price, expiry_date) VALUES (?, ?, ?, ?, ?)',
      [name, generic_name, stock_quantity, unit_price, expiry_date]
    );
    return { id: result.insertId, ...medData };
  },

  async update(id, medData) {
    const { name, generic_name, stock_quantity, unit_price, expiry_date } = medData;
    await db.query(
      'UPDATE medicines SET name = ?, generic_name = ?, stock_quantity = ?, unit_price = ?, expiry_date = ? WHERE id = ?',
      [name, generic_name, stock_quantity, unit_price, expiry_date, id]
    );
    return { id, ...medData };
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM medicines WHERE id = ?', [id]);
    return result.affectedRows;
  }
};