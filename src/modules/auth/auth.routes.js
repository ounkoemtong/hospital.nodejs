// src/modules/auth/auth.routes.js
import express from 'express';
import { register, login } from './auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@hospital.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               role_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request or email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', register); 

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@hospital.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);       

export default router;