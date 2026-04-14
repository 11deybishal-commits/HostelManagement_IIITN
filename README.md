🏨 Hostel Complaint Management System
=====================================

A modern, beautifully designed web application for managing hostel complaints with real-time tracking and efficient issue resolution powered by React + Vite frontend and Node/Express backend.

🎨 Features
-----------

✨ **Beautiful Light Theme Interface**
- Modern gradient-based design with smooth animations
- Bold typography for excellent readability
- IITN logo prominently displayed
- Fully responsive for all devices

📝 **Student Features**
- Submit complaints with auto-priority detection
- Track complaint status with unique ID
- Update personal information
- View category-specific issue submission

📊 **Admin Dashboard**
- Real-time analytics with charts
- Filter complaints by status
- Update complaint status with notes
- Visual dashboards with statistics
- Category and priority-based analytics

🔐 **Security**
- JWT-based admin authentication
- Password hashing with bcryptjs
- Protected API routes
- Input validation

🛠️ Tech Stack
--------------

**Frontend:**
- React 19 + Vite 7
- Framer Motion (animations)
- Recharts (data visualization)
- Modern CSS3

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- CORS enabled

📦 Quick Start
--------------

### Backend
```bash
cd backend
npm install
npm run dev  # Port 5000
```

### Frontend
```bash
npm install
npm run dev  # Port 5173
```

See **SETUP_GUIDE.md** for detailed installation instructions.

🚀 Default Admin Credentials
----------------------------
- Email: admin@iiitn.ac.in
- Password: Admin123!

(Change these immediately in production)

📋 API Endpoints
----------------

**Complaints:**
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/complaint/:id` - Get status
- `GET /api/complaints` - List all (admin)
- `PUT /api/complaints/:id` - Update (admin)

**Admin:**
- `POST /api/admin/login` - Login
- `GET /api/admin/profile` - Profile (protected)

🎯 Complaint Categories
------------------------
- ⚡ Electricity
- 💧 Water Supply
- 🧹 Cleaning
- 📶 Internet
- 🔧 Other

📊 Priority Levels
------------------
- 🔴 High (Urgent situations)
- 🟡 Medium (Scheduled issues)
- 🟢 Low (Minor issues)

💡 Key Animations
-----------------
- Smooth page transitions
- Button hover effects with scaling
- Card elevation on interaction
- Animated statistics display
- Floating decorative elements
- Data chart animations

📁 Project Structure
--------------------
```
hostelflow/
├── backend/           # Node/Express API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   └── server.js
├── src/              # React frontend
│   ├── components/   # React components
│   ├── api.js       # API service
│   └── App.jsx
└── README.md
```

🔄 Workflow
-----------

**Student:**
1. Home → Raise Complaint
2. Fill details & submit
3. Receive complaint ID
4. Track status

**Admin:**
1. Login with credentials
2. View dashboard
3. Review complaints
4. Update status & notes
5. Track resolution

🎨 Color Scheme
---------------
- Primary Blue: #2e5090
- Secondary Cyan: #00b4d8
- Accent Pink: #ff006e
- Success Green: #28a745
- Light Background: #f8f9ff

📱 Responsive Design
-------------------
- Mobile: Optimized for small screens
- Tablet: Flexible two-column layout
- Desktop: Full feature display

🔐 Security Features
--------------------
- JWT token-based authentication
- Password hashing (bcryptjs)
- CORS protection
- Secure routes with middleware
- Input validation

📞 Support
----------
Contact hostel administration for access issues.

---

**Made with ❤️ for IITN Nagpur Hostel Management**

LINK:https://hostel-management-iiitn.netlify.app/

The API has been disabled for now. Could be cloned later.