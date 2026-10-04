import express from 'express';
import cors from 'cors';
import swaggerConfig from './config/swagger.js'; // 📥 នាំចូលជា Default
import authRoutes from './modules/auth/auth.routes.js';
import patientRoutes from './modules/patients/patient.routes.js';
import doctorRoutes from './modules/doctors/doctor.routes.js';
import pharmacyRoutes from './modules/pharmacy/pharmacy.routes.js';
import appointmentRoutes from './modules/appointments/appointments.routes.js';
import prescriptionRoutes from './modules/Prescriptions/prescription.routes.js';
import prescriptionItemRoutes from './modules/prescription-items/prescription-item.routes.js';
import billingRoutes from './modules/Billing/billing.route.js'
import permissionRoute from './modules/Permissions/permission.route.js'
import medicalRecordRoutes from './modules/medical-records/medical-record.routes.js';
const app = express();

app.use(express.json());

// 🔗 ភ្ជាប់ Swagger UI ដោយប្រើ swaggerConfig
app.use('/api-docs', swaggerConfig.swaggerUi.serve, swaggerConfig.swaggerUi.setup(swaggerConfig.specs));

// Routes ដើមរបស់អ្នក
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/pharmacys', pharmacyRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescription-items', prescriptionItemRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/permissions',permissionRoute);
app.use('/api/medical-records', medicalRecordRoutes);

export default app;