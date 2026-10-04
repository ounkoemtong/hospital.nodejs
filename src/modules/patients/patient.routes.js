// src/modules/patients/patient.routes.js
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';
import express from 'express';
import { 
  getAllPatients, 
  createPatient, 
  updatePatient, 
  deletePatient 
} from './patient.controller.js';

const router = express.Router();

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of all patients retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, requirePermission('manage_patients'), getAllPatients);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - age
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: KEO Vicheka
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Female
 *               age:
 *                 type: integer
 *                 example: 24
 *               phone:
 *                 type: string
 *                 example: "012111222"
 *               address:
 *                 type: string
 *                 example: Phnom Penh
 *               blood_group:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *                 example: O+
 *               allergies:
 *                 type: string
 *                 example: Penicillin
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Bad request or missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, requirePermission('manage_patients'), createPatient);
/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update an existing patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: KEO Vicheka Updated
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Female
 *               age:
 *                 type: integer
 *                 example: 25
 *               phone:
 *                 type: string
 *                 example: "012111222"
 *               address:
 *                 type: string
 *                 example: Siem Reap
 *               blood_group:
 *                 type: string
 *                 example: O+
 *               allergies:
 *                 type: string
 *                 example: None
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', verifyToken, requirePermission('manage_patients'), updatePatient);
/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID to delete
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, requirePermission('manage_patients'), deletePatient);
export default router;