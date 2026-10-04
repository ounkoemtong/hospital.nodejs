// src/modules/appointments/appointment.routes.js
import express from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from './appointments.controller.js';

// 📥 នាំចូល Middleware ពិនិត្យ Token និង សិទ្ធិ
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments (Admin/Doctor/Staff only)
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of all appointments retrieved successfully
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, requirePermission('manage_appointments'), getAllAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment details retrieved successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', verifyToken, requirePermission('manage_appointments'), getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - doctor_id
 *               - appointment_date
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               doctor_id:
 *                 type: integer
 *                 example: 2
 *               appointment_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-05T10:00:00Z
 *               reason:
 *                 type: string
 *                 example: Routine checkup
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Bad request or missing required fields
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, requirePermission('manage_appointments'), createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an existing appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               doctor_id:
 *                 type: integer
 *                 example: 2
 *               appointment_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-06T14:30:00Z
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Completed, Cancelled]
 *                 example: Confirmed
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', verifyToken, requirePermission('manage_appointments'), updateAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID to delete
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, requirePermission('manage_appointments'), deleteAppointment);

export default router;