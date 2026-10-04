// src/modules/prescription-items/prescription-item.routes.js
import express from 'express';
import {
  getAllPrescriptionItems,
  getItemsByPrescription,
  addPrescriptionItem,
  removePrescriptionItem
} from './prescription-item.controller.js';

// 📥 នាំចូល Middleware ពិនិត្យ Token និង សិទ្ធិ
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /prescription-items:
 *   get:
 *     summary: Get all prescription items
 *     tags: [Prescription Items]
 *     responses:
 *       200:
 *         description: List of all prescription items
 */
router.get('/', verifyToken, getAllPrescriptionItems);

/**
 * @swagger
 * /prescription-items/prescription/{prescriptionId}:
 *   get:
 *     summary: Get items by prescription ID
 *     tags: [Prescription Items]
 *     parameters:
 *       - in: path
 *         name: prescriptionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The prescription ID
 *     responses:
 *       200:
 *         description: List of items for the specific prescription
 */
router.get('/prescription/:prescriptionId', verifyToken, getItemsByPrescription);

/**
 * @swagger
 * /prescription-items:
 *   post:
 *     summary: Add a new prescription item
 *     tags: [Prescription Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prescriptionId:
 *                 type: integer
 *               medicineId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Prescription item added successfully
 */
router.post('/', verifyToken, requirePermission('manage_prescriptions'), addPrescriptionItem);

/**
 * @swagger
 * /prescription-items/{id}:
 *   delete:
 *     summary: Remove a prescription item by ID
 *     tags: [Prescription Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Prescription item removed successfully
 */
router.delete('/:id', verifyToken, requirePermission('manage_prescriptions'), removePrescriptionItem);

export default router;