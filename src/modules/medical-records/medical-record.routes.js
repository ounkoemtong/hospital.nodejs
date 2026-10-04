import express from 'express';
import {
  getAllMedicalRecords,
  getMedicalRecordById,
  getMyMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} from './medical-record.controller.js';

import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /medical-records/my-records:
 *   get:
 *     summary: Get logged-in patient's own medical records
 *     tags: [Medical Records]
 *     responses:
 *       200:
 *         description: Patient medical records retrieved successfully
 */
router.get('/my-records', verifyToken, getMyMedicalRecords);

/**
 * @swagger
 * /medical-records:
 *   get:
 *     summary: Get all medical records (Staff/Doctor only)
 *     tags: [Medical Records]
 *     responses:
 *       200:
 *         description: List of all medical records
 */
router.get('/', verifyToken, requirePermission('manage_medical_records'), getAllMedicalRecords);

/**
 * @swagger
 * /medical-records/{id}:
 *   get:
 *     summary: Get medical record by ID
 *     tags: [Medical Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medical record found
 */
router.get('/:id', verifyToken, requirePermission('manage_medical_records'), getMedicalRecordById);

/**
 * @swagger
 * /medical-records:
 *   post:
 *     summary: Create a new medical record
 *     tags: [Medical Records]
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', verifyToken, requirePermission('manage_medical_records'), createMedicalRecord);

/**
 * @swagger
 * /medical-records/{id}:
 *   put:
 *     summary: Update medical record by ID
 *     tags: [Medical Records]
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put('/:id', verifyToken, requirePermission('manage_medical_records'), updateMedicalRecord);

/**
 * @swagger
 * /medical-records/{id}:
 *   delete:
 *     summary: Delete medical record by ID
 *     tags: [Medical Records]
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/:id', verifyToken, requirePermission('manage_medical_records'), deleteMedicalRecord);

export default router;