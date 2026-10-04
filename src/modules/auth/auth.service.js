// src/modules/auth/auth.service.js
import { AuthModel } from './auth.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // 📥 នាំចូល jsonwebtoken

// 🔑 កំណត់ Secret Key (អាចយកពី process.env.JWT_SECRET បាន)
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_here';

export const AuthService = {
  // Register and hash password 
  async registerUser(userData) {
    const { name, email, password, role_id } = userData;

    const existingUser = await AuthModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists!');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userRoleId = role_id || 1;

    const newUser = await AuthModel.createUser({
      name,
      email,
      password: hashedPassword, 
      role_id: userRoleId
    });

    // 🪙 បង្កើត Token សម្រាប់ User ថ្មី (អាចឱ្យ Login ចូលស្វ័យប្រវត្តិក្រោយ Register)
    const token = jwt.sign(
      { id: newUser.id, role_id: newUser.role_id },
      JWT_SECRET,
      { expiresIn: '1d' } // កំណត់ឱ្យផុតកំណត់ក្នុងរយៈពេល ១ថ្ងៃ
    );

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role_id: newUser.role_id
      },
      token // 📤 ផ្ញើ token ទៅជាមួយ
    };
  },

  // Login for compare email and password 
  async loginUser(credentials) {
    const { email, password } = credentials;

    // search email ..
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      throw new Error('User not found!');
    }

    // compare password with hash password in database 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password!');
    }

    // 🪙 បង្កើត JWT Token ពេល Login ជោគជ័យ
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // if it true return user data and token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id
      },
      token // 📤 ផ្ញើ token ទៅជាមួយ
    };
  }
};