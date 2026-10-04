// src/modules/billing/billing.routes.js
import express from 'express';
import { getAllBills, createBill, checkoutWithAba, checkAbaPaymentStatus } from './billing.controller.js';

// 📥 នាំចូល Middleware ពិនិត្យ Token និង សិទ្ធិ
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /billing:
 *   get:
 *     summary: Get all invoices / bills
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: List of all invoices
 */
router.get('/', verifyToken, requirePermission('manage_invoices'), getAllBills);

/**
 * @swagger
 * /billing:
 *   post:
 *     summary: Create a new invoice / bill
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               appointment_id:
 *                 type: integer
 *               consultation_amount:
 *                 type: number
 *               medicine_amount:
 *                 type: number
 *               total_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Invoice created successfully
 */
router.post('/', verifyToken, requirePermission('manage_invoices'), createBill);

/**
 * @swagger
 * /billing/aba-callback:
 *   post:
 *     summary: Check or receive payment status from ABA PayWay
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tran_id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.post('/aba-callback', checkAbaPaymentStatus); // មិនបាច់ដាក់ verifyToken ទេ ព្រោះមកពី ABA Server

/**
 * @swagger
 * /billing/{id}/checkout-aba:
 *   post:
 *     summary: Generate ABA PayWay checkout parameters for an invoice
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice ID to checkout
 *     responses:
 *       200:
 *         description: ABA checkout data generated successfully
 */
router.post('/:id/checkout-aba', verifyToken, requirePermission('manage_invoices'), checkoutWithAba);

export default router;