import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
await connectDB();

// Seed default admin for local development
const ensureDefaultAdmin = async () => {
  const defaultEmail = 'admin@iiitn.ac.in';
  const defaultPassword = 'Admin123!';
  const defaultAdmin = await Admin.findOne({ email: defaultEmail });

  if (!defaultAdmin) {
    await Admin.create({
      email: defaultEmail,
      password: defaultPassword,
      name: 'Hostel Administrator',
      role: 'superadmin',
      department: 'Hostel Administration',
    });
    console.log('✅ Default admin account created');
    return;
  }

  const passwordMatches = await defaultAdmin.comparePassword(defaultPassword);
  if (!passwordMatches) {
    defaultAdmin.password = defaultPassword;
    defaultAdmin.role = defaultAdmin.role || 'superadmin';
    defaultAdmin.name = defaultAdmin.name || 'Hostel Administrator';
    defaultAdmin.department = defaultAdmin.department || 'Hostel Administration';
    await defaultAdmin.save();
    console.log('✅ Default admin password reset');
  }
};

await ensureDefaultAdmin();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// API Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
