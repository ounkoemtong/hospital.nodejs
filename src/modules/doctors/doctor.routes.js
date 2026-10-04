import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} from './doctor.controller.js';

// 📥 នាំចូល Middleware ពិនិត្យ Token និង សិទ្ធិ
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of all doctors retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, getAllDoctors); // 🔒 គ្រាន់តែត្រូវការ Login

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get a doctor by ID
 *     tags: [Doctors]
 *     ...
 */
router.get('/:id', verifyToken, getDoctorById); // 🔒 គ្រាន់តែត្រូវការ Login

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     ...
 */
router.post('/', verifyToken, requirePermission('manage_doctors'), createDoctor); // 🔒 ត្រូវ Login + មានសិទ្ធិ 'manage_doctors'

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update an existing doctor by ID
 *     tags: [Doctors]
 *     ...
 */
router.put('/:id', verifyToken, requirePermission('manage_doctors'), updateDoctor); // 🔒 ត្រូវ Login + មានសិទ្ធិ 'manage_doctors'

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Delete a doctor by ID
 *     tags: [Doctors]
 *     ...
 */
router.delete('/:id', verifyToken, requirePermission('manage_doctors'), deleteDoctor); // 🔒 ត្រូវ Login + មានសិទ្ធិ 'manage_doctors'

export default router;