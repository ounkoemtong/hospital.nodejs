// src/config/seed.js
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const seedDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hospital_db',
    port: Number(process.env.DB_PORT) || 3306,
  });

  try {
    console.log('🌱 Starting comprehensive database seeding...\n');

    // 1. Password Hashing
    const defaultPassword = 'Password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // ==========================================
    // 1. Seed PERMISSIONS (New)
    // ==========================================
    const permissions = [
      ['manage_users', 'Can create, update, and delete system users'],
      ['manage_patients', 'Can register and update patient details'],
      ['manage_appointments', 'Can schedule and update appointments'],
      ['manage_prescriptions', 'Can write and dispense prescriptions'],
      ['manage_medicines', 'Can manage medicine inventory stock'],
      ['manage_invoices', 'Can create invoices and verify payments'],
    ];

    for (const perm of permissions) {
      const [exists] = await connection.query('SELECT id FROM permissions WHERE name = ?', [perm[0]]);
      if (exists.length === 0) {
        await connection.query(
          'INSERT INTO permissions (name, description) VALUES (?, ?)',
          perm
        );
        console.log(`  ➕ [permissions] Inserted: ${perm[0]}`);
      }
    }

    // ==========================================
    // 2. Seed ROLE_PERMISSIONS (Mapping Roles to Permissions)
    // SUPER_ADMIN (ID: 1) gets all permissions
    // ==========================================
    const [allPermissions] = await connection.query('SELECT id FROM permissions');
    for (const perm of allPermissions) {
      const [exists] = await connection.query(
        'SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?',
        [1, perm.id]
      );
      if (exists.length === 0) {
        await connection.query(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [1, perm.id]
        );
      }
    }
    console.log('  ➕ [role_permissions] Assigned all permissions to SUPER_ADMIN (Role ID: 1)');

    // ==========================================
    // 3. Seed USERS (Staff using role_id reference)
    // ==========================================
    const users = [
      ['Super Admin', 'admin@hospital.com', hashedPassword, 1],
      ['Dr. Chan Dara', 'dara.doctor@hospital.com', hashedPassword, 2],
      ['Dr. Keo Samnang', 'samnang.doctor@hospital.com', hashedPassword, 2],
      ['Nurse Sokha', 'sokha.nurse@hospital.com', hashedPassword, 3],
      ['Receptionist Bopha', 'bopha.rec@hospital.com', hashedPassword, 4],
      ['Pharmacist David', 'david.pharma@hospital.com', hashedPassword, 5],
      ['Cashier Lina', 'lina.cashier@hospital.com', hashedPassword, 6],
    ];

    for (const user of users) {
      const [exists] = await connection.query('SELECT id FROM users WHERE email = ?', [user[1]]);
      if (exists.length === 0) {
        await connection.query(
          'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
          user
        );
        console.log(`  ➕ [users] Inserted: ${user[0]} (Role ID: ${user[3]})`);
      }
    }

    // ==========================================
    // 4. Seed PATIENTS
    // ==========================================
    const patients = [
      ['KEO Vicheka', 'Female', 24, '012111222', 'Phnom Penh', 'O+', 'Penicillin'],
      ['HENG Ratana', 'Male', 35, '098333444', 'Kandal', 'B+', 'None'],
      ['SOUN Pich', 'Female', 19, '077555666', 'Siem Reap', 'A+', 'Dust, Peanuts'],
    ];

    for (const patient of patients) {
      const [exists] = await connection.query('SELECT id FROM patients WHERE phone = ?', [patient[3]]);
      if (exists.length === 0) {
        await connection.query(
          'INSERT INTO patients (name, gender, age, phone, address, blood_group, allergies) VALUES (?, ?, ?, ?, ?, ?, ?)',
          patient
        );
        console.log(`  ➕ [patients] Inserted: ${patient[0]}`);
      }
    }

    // ==========================================
    // 5. Seed MEDICINES (Pharmacy)
    // ==========================================
    const medicines = [
      ['Paracetamol 500mg', 'Acetaminophen', 250, 0.05, '2027-12-31'],
      ['Amoxicillin 500mg', 'Amoxicillin', 120, 0.25, '2026-11-15'],
      ['Ibuprofen 400mg', 'Ibuprofen', 180, 0.15, '2027-06-30'],
      ['Cetirizine 10mg', 'Cetirizine HCl', 90, 0.10, '2028-01-20'],
    ];

    for (const med of medicines) {
      const [exists] = await connection.query('SELECT id FROM medicines WHERE name = ?', [med[0]]);
      if (exists.length === 0) {
        await connection.query(
          'INSERT INTO medicines (name, generic_name, stock_quantity, unit_price, expiry_date) VALUES (?, ?, ?, ?, ?)',
          med
        );
        console.log(`  ➕ [medicines] Inserted: ${med[0]}`);
      }
    }

    // ==========================================
    // 6. Seed DOCTORS (Linked to users via JOIN roles)
    // ==========================================
    const [doctorUsers] = await connection.query(`
      SELECT u.id, u.name 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'DOCTOR'
    `);

    for (const doc of doctorUsers) {
      const [exists] = await connection.query('SELECT id FROM doctors WHERE user_id = ?', [doc.id]);
      if (exists.length === 0) {
        const spec = doc.name.includes('Dara') ? 'Cardiology' : 'Pediatrics';
        const fee = doc.name.includes('Dara') ? 25.00 : 20.00;
        const room = doc.name.includes('Dara') ? 'Room 201' : 'Room 105';
        const phone = doc.name.includes('Dara') ? '012345678' : '098765432';

        await connection.query(
          'INSERT INTO doctors (user_id, specialization, phone, consultation_fee, room_number) VALUES (?, ?, ?, ?, ?)',
          [doc.id, spec, phone, fee, room]
        );
        console.log(`  ➕ [doctors] Created profile for: ${doc.name} with phone: ${phone}`);
      }
    }

    // Retrieve references for relational tables
    const [allPatients] = await connection.query('SELECT id, name FROM patients LIMIT 3');
    const [allDoctors] = await connection.query('SELECT id, consultation_fee FROM doctors LIMIT 2');
    const [allMeds] = await connection.query('SELECT id, unit_price FROM medicines LIMIT 2');

    if (allPatients.length > 0 && allDoctors.length > 0) {
      const patient1 = allPatients[0];
      const doctor1 = allDoctors[0];

      // ==========================================
      // 7. Seed APPOINTMENTS
      // ==========================================
      const [appointmentExists] = await connection.query(
        'SELECT id FROM appointments WHERE patient_id = ? AND doctor_id = ?',
        [patient1.id, doctor1.id]
      );

      let appointmentId;
      if (appointmentExists.length === 0) {
        const [appResult] = await connection.query(
          'INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason) VALUES (?, ?, NOW(), ?, ?)',
          [patient1.id, doctor1.id, 'COMPLETED', 'Regular checkup for persistent headache']
        );
        appointmentId = appResult.insertId;
        console.log(`  ➕ [appointments] Created appointment #${appointmentId}`);
      } else {
        appointmentId = appointmentExists[0].id;
      }

      // ==========================================
      // 8. Seed PRESCRIPTIONS
      // ==========================================
      const [prescriptionExists] = await connection.query(
        'SELECT id FROM prescriptions WHERE appointment_id = ?',
        [appointmentId]
      );

      let prescriptionId;
      if (prescriptionExists.length === 0) {
        const [presResult] = await connection.query(
          'INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, instructions) VALUES (?, ?, ?, ?, ?)',
          [
            appointmentId,
            patient1.id,
            doctor1.id,
            'Mild tension headache and fatigue',
            'Drink at least 2L of water daily and take medications after food.'
          ]
        );
        prescriptionId = presResult.insertId;
        console.log(`  ➕ [prescriptions] Created prescription #${prescriptionId}`);
      } else {
        prescriptionId = prescriptionExists[0].id;
      }

      // ==========================================
      // 9. Seed PRESCRIPTION ITEMS
      // ==========================================
      if (allMeds.length > 0) {
        const med1 = allMeds[0];
        const [itemExists] = await connection.query(
          'SELECT id FROM prescription_items WHERE prescription_id = ? AND medicine_id = ?',
          [prescriptionId, med1.id]
        );

        if (itemExists.length === 0) {
          await connection.query(
            'INSERT INTO prescription_items (prescription_id, medicine_id, dosage, duration_days, quantity_prescribed) VALUES (?, ?, ?, ?, ?)',
            [prescriptionId, med1.id, '1 tablet every 8 hours', 5, 15]
          );
          console.log(`  ➕ [prescription_items] Added medicine #${med1.id} to prescription`);
        }
      }

      // ==========================================
      // 10. Seed INVOICES (Billing)
      // ==========================================
      const [invoiceExists] = await connection.query(
        'SELECT id FROM invoices WHERE appointment_id = ?',
        [appointmentId]
      );

      if (invoiceExists.length === 0) {
        const consultFee = parseFloat(doctor1.consultation_fee) || 20.00;
        const medCost = 0.75; 
        const total = consultFee + medCost;

        await connection.query(
          `INSERT INTO invoices 
           (patient_id, appointment_id, consultation_amount, medicine_amount, total_amount, payment_status, payment_method) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [patient1.id, appointmentId, consultFee, medCost, total, 'PAID', 'KHQR']
        );
        console.log(`  ➕ [invoices] Generated invoice for patient #${patient1.id} ($${total})`);
      }
    }

    // ==========================================
    // 11. Seed MULTIPLE APPOINTMENTS
    // ==========================================
    const appointmentsData = [
      { patient_index: 0, doctor_index: 0, status: 'COMPLETED', reason: 'Regular checkup for persistent headache' },
      { patient_index: 1, doctor_index: 1, status: 'PENDING', reason: 'Fever and body ache symptoms' },
      { patient_index: 2, doctor_index: 0, status: 'CONFIRMED', reason: 'Skin allergy consultation' }
    ];

    for (const app of appointmentsData) {
      const p = allPatients[app.patient_index % allPatients.length];
      const d = allDoctors[app.doctor_index % allDoctors.length];

      const [appointmentExists] = await connection.query(
        'SELECT id FROM appointments WHERE patient_id = ? AND doctor_id = ? AND status = ?',
        [p.id, d.id, app.status]
      );

      if (appointmentExists.length === 0) {
        await connection.query(
          'INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason) VALUES (?, ?, NOW(), ?, ?)',
          [p.id, d.id, app.status, app.reason]
        );
        console.log(`  ➕ [appointments] Created appointment for Patient #${p.id} with Doctor #${d.id}`);
      }
    }
    // ==========================================
    // 12. Seed MEDICAL RECORDS
    // ==========================================
    const [existingRecords] = await connection.query('SELECT id FROM medical_records LIMIT 1');
    if (existingRecords.length === 0 && allPatients.length > 0 && allDoctors.length > 0) {
      const patient = allPatients[0];
      const doctor = allDoctors[0];

      await connection.query(
        `INSERT INTO medical_records 
         (patient_id, doctor_id, diagnosis, treatment, prescriptions, notes) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          patient.id,
          doctor.id,
          'Patient presented with chronic migraine and tension headaches.',
          'Prescribed hydration therapy, physical rest, and mild pain relievers.',
          'Paracetamol 500mg - 15 tablets',
          'Patient advised to return for a follow-up checkup in 2 weeks.'
        ]
      );
      console.log(`  ➕ [medical_records] Created initial medical record for patient #${patient.id}`);
    }

    console.log('\n🎉 All tables and permissions seeded successfully bro!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
  } finally {
    await connection.end();
    process.exit(0);
  }
};

seedDatabase();