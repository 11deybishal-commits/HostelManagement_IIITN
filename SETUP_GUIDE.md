# 🏨 HostelFlow - Smart Hostel Complaint Management System

A modern, beautiful web-based platform for managing hostel complaints with real-time tracking and efficient issue resolution.

## ✨ Features

### 🎨 **Beautiful Light-Themed Interface**
- Modern, clean design with gradient backgrounds
- Smooth animations powered by Framer Motion
- Responsive layout for all devices (mobile, tablet, desktop)
- Bold, prominent typography for better readability

### 📝 **Student Complaint Portal**
- Easy-to-use complaint submission form
- Auto-detection of complaint priority
- Real-time complaint ID generation
- Automatic categorization (Electricity, Water, Cleaning, Internet, Other)
- Profile information management
- Email and phone contact fields

### 📊 **Admin Dashboard**
- Comprehensive analytics with charts
- View all complaints with detailed information
- Filter complaints by status
- Real-time status updates
- Category and status-based analytics
- Visual priority indicators
- Secure login system

### 🔔 **Real-time Updates**
- Live complaint tracking
- Status change notifications
- Admin notes for complaints
- Complaint resolution timestamps

## 🛠️ **Tech Stack**

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool
- **Framer Motion 12** - Animations
- **Recharts 3** - Data visualization
- **CSS3** - Modern styling

### Backend
- **Node.js & Express** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **CORS** - Cross-origin support

## 📋 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hostelflow
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # On Windows
   mongod

   # Or use MongoDB Atlas cloud service
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   Server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL** (optional)
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend will start on `http://localhost:5173`

### Create Admin Account (Optional)

You can seed an admin account by creating a `seed.js` file in the backend:

```javascript
import Admin from './models/Admin.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedAdmin() {
  await connectDB();
  
  const admin = new Admin({
    email: 'admin@iiitn.ac.in',
    password: 'Admin123!',
    name: 'Admin',
    role: 'superadmin'
  });
  
  await admin.save();
  console.log('Admin created successfully');
  process.exit(0);
}

seedAdmin();
```

Run: `node seed.js`

## 🚀 Usage

### Student Workflow
1. Navigate to **Home Page**
2. Click **"Raise Complaint"** button
3. Fill in student details:
   - Full Name
   - Roll Number
   - Hostel Name
   - Room Number
   - Email & Phone (optional)
4. Select complaint category
5. Describe the issue
6. Submit and receive complaint ID
7. Keep ID for status tracking

### Admin Workflow
1. Navigate to **Admin Panel**
2. Click **"Sign In"** with credentials:
   - Email: `admin@iiitn.ac.in`
   - Password: `Admin123!`
3. View dashboard with statistics
4. View complaints by category and status
5. Filter complaints using status selector
6. Update complaint status
7. Add admin notes
8. Track resolution progress

## 📊 API Endpoints

### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/complaint/:complaintId` - Get complaint status
- `GET /api/complaints` - Get all complaints (admin)
- `PUT /api/complaints/:complaintId` - Update complaint (admin)
- `DELETE /api/complaints/:complaintId` - Delete complaint (admin)
- `GET /api/complaints/analytics/category` - Category analytics (admin)
- `GET /api/complaints/analytics/status` - Status analytics (admin)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile (protected)
- `POST /api/admin/create` - Create new admin (protected)

## 🎨 Color Palette

- **Primary**: #2e5090 (Dark Blue)
- **Secondary**: #00b4d8 (Cyan)
- **Accent**: #ff006e (Pink)
- **Success**: #28a745 (Green)
- **Warning**: #ffc107 (Yellow)
- **Danger**: #dc3545 (Red)
- **Light Background**: #f8f9ff

## 📱 Responsive Design

- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Two column layout
- **Desktop**: > 1024px - Full multi-column layout

## 🔐 Security Features

- JWT authentication for admin access
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Protected API routes
- Secure token storage

## 📦 Project Structure

```
hostelflow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── complaintController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Complaint.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── src/
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── ComplaintForm.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── AdminLogin.jsx
│   ├── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

### Backend (Render/Railway/Heroku)
```bash
npm install
npm start
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection
- Verify PORT is not in use
- Check .env file configuration

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env
- Verify CORS is enabled
- Check browser network tab for errors

### Complaints not loading
- Verify MongoDB is running
- Check backend server logs
- Confirm JWT token is valid

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostelflow
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

**Developed for:** Indian Institute of Information Technology (IITN), Nagpur

## 📞 Support

For issues or questions, contact the hostel administration or IT department.

---

**Made with ❤️ for better hostel management**
