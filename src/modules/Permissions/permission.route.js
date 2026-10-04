// src/modules/permissions/permission.routes.js
import express from 'express';
import { 
  getAllPermissions, 
  createPermission, 
  deletePermission,
  updatePermission 
} from './permission.controller.js';

// 📥 នាំចូល Middleware ពិនិត្យ Token និង សិទ្ធិ
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of all permissions retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, requirePermission('manage_permissions'), getAllPermissions);

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: manage_finances
 *               description:
 *                 type: string
 *                 example: Can manage financial reports and records
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Permission name is required
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, requirePermission('manage_permissions'), createPermission);

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update an existing permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Permission ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: manage_finances
 *               description:
 *                 type: string
 *                 example: Updated description for financial management
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         description: Permission name is required
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', verifyToken, requirePermission('manage_permissions'), updatePermission);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Permission ID to delete
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, requirePermission('manage_permissions'), deletePermission);

export default router;