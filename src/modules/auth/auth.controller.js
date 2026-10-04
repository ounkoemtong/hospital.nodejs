// src/modules/auth/auth.controller.js
import { AuthService } from './auth.service.js';

// Register Function 
export const register = async (req, res) => {
  try {
    const newUser = await AuthService.registerUser(req.body);
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully!',
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Login function 
export const login = async (req, res) => {
  try {
    const userData = await AuthService.loginUser(req.body);
    res.status(200).json({
      status: 'success',
      message: 'Login successful!',
      data: userData
    });
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: error.message
    });
  }
};