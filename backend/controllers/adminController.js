/* eslint-env node */
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import process from 'node:process';

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPassword = typeof password === 'string' ? password.trim() : '';

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(normalizedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { _id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Create Admin (superadmin only)
export const createAdmin = async (req, res) => {
  try {
    const { email, password, name, role, department } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const admin = new Admin({
      email,
      password,
      name,
      role: role || 'admin',
      department,
    });

    await admin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Failed to create admin', error: error.message });
  }
};

// Public admin registration for first-time access
export const registerAdmin = async (req, res) => {
  try {
    const { email, password, name, department } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPassword = typeof password === 'string' ? password.trim() : '';
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedDepartment = typeof department === 'string' ? department.trim() : '';

    if (!normalizedEmail || !normalizedPassword || !normalizedName) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    if (normalizedPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const admin = new Admin({
      email: normalizedEmail,
      password: normalizedPassword,
      name: normalizedName,
      role: 'admin',
      department: normalizedDepartment,
    });

    await admin.save();

    const token = jwt.sign(
      { _id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Failed to register admin', error: error.message });
  }
};
