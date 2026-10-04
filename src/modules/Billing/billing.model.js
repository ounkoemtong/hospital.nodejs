import db from '../../config/db.js';

class BillingModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM invoices');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM invoices WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { patient_id, appointment_id, consultation_amount, medicine_amount, total_amount, payment_status, payment_method } = data;
    
    const [result] = await db.query(
      `INSERT INTO invoices (patient_id, appointment_id, consultation_amount, medicine_amount, total_amount, payment_status, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id, 
        appointment_id || null, 
        consultation_amount || 0.00, 
        medicine_amount || 0.00, 
        total_amount || 0.00, 
        payment_status || 'UNPAID', 
        payment_method || 'CASH'
      ]
    );
    return { id: result.insertId, ...data };
  }

  // 🔍 រកមើល Invoice តាម tran_id
  static async getByTranId(tranId) {
    const [rows] = await db.query('SELECT * FROM invoices WHERE tran_id = ?', [tranId]);
    return rows[0] || null;
  }

  // 📝 រក្សាទុក tran_id ពេលបង្កើត checkout ជាមួយ ABA
  static async updateTranId(id, tranId) {
    await db.query('UPDATE invoices SET tran_id = ? WHERE id = ?', [tranId, id]);
    return true;
  }

  // 💾 Update ស្ថានភាពទៅជា PAID ពេលបង់ប្រាក់ជោគជ័យ
  static async updateStatusToPaid(tranId, paymentMethod) {
    await db.query(
      `UPDATE invoices 
       SET payment_status = 'PAID', payment_method = ?, paid_at = NOW() 
       WHERE tran_id = ?`,
      [paymentMethod, tranId]
    );
    return true;
  }
}

export default BillingModel;