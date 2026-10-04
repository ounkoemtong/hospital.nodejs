// src/modules/prescriptions/prescription.routes.js
import express from 'express';
import {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
} from './prescription.controller.js';

// 📥 នាំចូល Middleware ពិនិត្យ Token និង សិទ្ធិ
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /prescriptions:
 *   get:
 *     summary: Get all prescriptions
 *     tags: [Prescriptions]
 *     responses:
 *       200:
 *         description: List of all prescriptions
 */
router.get('/', verifyToken, requirePermission('manage_prescriptions'), getAllPrescriptions);

/**
 * @swagger 
 * /prescriptions/{id}:
 *   get:
 *     summary: Get prescription by ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The prescription ID
 *     responses:
 *       200:
 *         description: Prescription details found successfully
 */
router.get('/:id', verifyToken, requirePermission('manage_prescriptions'), getPrescriptionById);

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Create a new prescription
 *     tags: [Prescriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *               doctorId:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prescription created successfully
 */
router.post('/', verifyToken, requirePermission('manage_prescriptions'), createPrescription);

/**
 * @swagger
 * /prescriptions/{id}:
 *   put:
 *     summary: Update a prescription by ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The prescription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 */
router.put('/:id', verifyToken, requirePermission('manage_prescriptions'), updatePrescription);

/**
 * @swagger
 * /prescriptions/{id}:
 *   delete:
 *     summary: Delete a prescription by ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The prescription ID
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 */
router.delete('/:id', verifyToken, requirePermission('manage_prescriptions'), deletePrescription);

export default router;