// src/config/migrate.js
import mysql from 'mysql2/promise';
import 'dotenv/config';

const migrate = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 3306,
  });

  try {
    console.log('🔄 Starting full database migration (Fresh Reset)...');

    const dbName = process.env.DB_NAME || 'hospital_db';

    // 1. Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database "${dbName}" ready!`);

    await connection.changeUser({ database: dbName });

    // 2. Drop existing tables in reverse order of dependencies (to avoid foreign key errors)
    await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await connection.query(`
      DROP TABLE IF EXISTS role_permissions, permissions, medical_records, invoices, prescription_items, prescriptions, 
                           appointments, doctors, medicines, patients, users, roles;
    `);
    await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    console.log('🗑️ Old tables dropped successfully!');

    // 3. Roles table (Must be created before users and role_permissions table)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table 1/12: "roles" created!');

    // Seed default roles
    await connection.query(`
      INSERT INTO roles (id, name, description) VALUES
      (1, 'SUPER_ADMIN', 'Has full access to all system configurations and management'),
      (2, 'DOCTOR', 'Can view patients, write prescriptions, and manage appointments'),
      (3, 'NURSE', 'Can manage patient vitals and assist in wards'),
      (4, 'RECEPTIONIST', 'Can register patients and schedule appointments'),
      (5, 'PHARMACIST', 'Can manage medicine inventory and dispense prescriptions'),
      (6, 'CASHIER', 'Can handle billing, invoices, and process payments'),
      (7, 'PATIENT', 'Can handle billing, invoices, and process payments');
    `);
    console.log('✅ Default roles seeded successfully!');

    // 4. Permissions table (NEW)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table 2/12: "permissions" created!');

    // Seed default permissions (រួមទាំង manage_permissions និង manage_medical_records)
    await connection.query(`
      INSERT INTO permissions (name, description) VALUES
      ('manage_users', 'Can create, update, and delete system users'),
      ('manage_patients', 'Can register and update patient details'),
      ('manage_appointments', 'Can schedule and update appointments'),
      ('manage_prescriptions', 'Can write and dispense prescriptions'),
      ('manage_medicines', 'Can manage medicine inventory stock'),
      ('manage_invoices', 'Can create invoices and verify payments'),
      ('manage_medical_records', 'Can manage and view medical records'),
      ('manage_permissions', 'Can create and manage system permissions');
    `);
    console.log('✅ Default permissions seeded successfully!');

    // 5. Role Permissions table (Pivot table for Many-to-Many between Roles and Permissions) (NEW)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table 3/12: "role_permissions" created!');

    // Map all permissions to Super Admin (Role ID: 1) automatically during migration
    await connection.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT 1, id FROM permissions;
    `);
    console.log('✅ All permissions assigned to SUPER_ADMIN (Role ID: 1)');

    // 6. Users table (Using role_id linked to roles table)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
      );
    `);
    console.log('✅ Table 4/12: "users" created with role_id!');

    // 7. Patients table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        age INT NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        address TEXT,
        blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allergies TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table 5/12: "patients" created!');

    // 8. Medicines table (Pharmacy inventory)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS medicines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        generic_name VARCHAR(150),
        stock_quantity INT NOT NULL DEFAULT 0,
        unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        expiry_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table 6/12: "medicines" created!');

    // 9. Doctors table (Linked to users)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        specialization VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        room_number VARCHAR(20),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table 7/12: "doctors" created with phone!');

    // 10. Appointments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        appointment_date DATETIME NOT NULL,
        status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table 8/12: "appointments" created!');

    // 11. Prescriptions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL UNIQUE,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        diagnosis TEXT NOT NULL,
        instructions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table 9/12: "prescriptions" created!');

    // 12. Prescription Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS prescription_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        prescription_id INT NOT NULL,
        medicine_id INT NOT NULL,
        dosage VARCHAR(100) NOT NULL,
        duration_days INT NOT NULL,
        quantity_prescribed INT NOT NULL,
        FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
        FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table 10/12: "prescription_items" created!');

    // 13. Invoices table (Billing)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        appointment_id INT,
        consultation_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        medicine_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        payment_status ENUM('UNPAID', 'PAID', 'REFUNDED') DEFAULT 'UNPAID',
        payment_method ENUM('CASH', 'KHQR', 'CREDIT_CARD', 'ABA_PAYWAY') DEFAULT 'CASH',
        tran_id VARCHAR(255) NULL,
        paid_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ Table 11/12: "invoices" created!');

    // 14. Medical Records table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        diagnosis TEXT NOT NULL,
        treatment TEXT,
        prescriptions TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table 12/12: "medical_records" created!');

    console.log('\n🎉 All 12 tables migrated successfully with permissions and role relationships!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
    process.exit(0);
  }
};

migrate();