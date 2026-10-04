// src/modules/pharmacy/pharmacy.routes.js
import express from 'express';
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine
} from './pharmacy.controller.js';

// 📥 នាំចូល Middleware ពិនិត្យ Token និង សិទ្ធិ
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /pharmacys:
 *   get:
 *     summary: Get all medicines
 *     tags: [Pharmacy]
 *     responses:
 *       200:
 *         description: List of all medicines retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, getAllMedicines);

/**
 * @swagger
 * /pharmacys/{id}:
 *   get:
 *     summary: Get a medicine by ID
 *     tags: [Pharmacy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medicine ID
 *     responses:
 *       200:
 *         description: Medicine details retrieved successfully
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', verifyToken, getMedicineById);

/**
 * @swagger
 * /pharmacys:
 *   post:
 *     summary: Create a new medicine
 *     tags: [Pharmacy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Paracetamol 500mg
 *               category:
 *                 type: string
 *                 example: Painkiller
 *               price:
 *                 type: number
 *                 example: 2.50
 *               stock:
 *                 type: integer
 *                 example: 100
 *               expiry_date:
 *                 type: string
 *                 format: date
 *                 example: 2028-12-31
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *       400:
 *         description: Bad request or missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, requirePermission('manage_pharmacy'), createMedicine);

/**
 * @swagger
 * /pharmacys/{id}:
 *   put:
 *     summary: Update an existing medicine by ID
 *     tags: [Pharmacy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medicine ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 * stylesheet:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Paracetamol Updated
 *               category:
 *                 type: string
 *                 example: Painkiller
 *               price:
 *                 type: number
 *                 example: 3.00
 *               stock:
 *                 type: integer
 *                 example: 150
 *               expiry_date:
 *                 type: string
 *                 format: date
 *                 example: 2028-12-31
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', verifyToken, requirePermission('manage_pharmacy'), updateMedicine);

/**
 * @swagger
 * /pharmacys/{id}:
 *   delete:
 *     summary: Delete a medicine by ID
 *     tags: [Pharmacy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medicine ID to delete
 *     responses:
 *       200:
 *         description: Medicine deleted successfully
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, requirePermission('manage_pharmacy'), deleteMedicine);

export default router;