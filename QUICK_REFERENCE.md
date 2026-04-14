## 🚀 Quick Reference Guide - HostelFlow

### ⚡ Quick Start (5 minutes)

**Prerequisites:**
- Node.js installed
- MongoDB running (local or Atlas)

**Steps:**

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env                   # Configure if needed
   npm run dev
   ```

2. **Frontend Setup (new terminal):**
   ```bash
   npm install
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Admin: http://localhost:5173 (click Admin Panel)

### 📝 Default Credentials

```
Email:    admin@iiitn.ac.in
Password: Admin123!
```

⚠️ **Change these in production!**

### 🗂️ Key Files & Functions

**Frontend Components:**
- `src/components/Home.jsx` - Landing page
- `src/components/ComplaintForm.jsx` - Submit complaints
- `src/components/AdminDashboard.jsx` - Admin panel
- `src/components/AdminLogin.jsx` - Login form
- `src/api.js` - API service layer

**Backend Files:**
- `backend/server.js` - Main server
- `backend/models/Complaint.js` - Complaint schema
- `backend/controllers/complaintController.js` - Logic
- `backend/routes/complaintRoutes.js` - Endpoints
- `backend/config/db.js` - Database config

### 🔗 API Quick Reference

**Create Complaint:**
```bash
POST /api/complaints
{
  "studentName": "John Doe",
  "studentRoll": "IIITN-2024-001",
  "hostel": "Hostel A",
  "room": "204",
  "email": "john@example.com",
  "phone": "+91...",
  "category": "Electricity",
  "description": "Fan not working",
  "priority": "High"
}
```

**Get Complaint:**
```bash
GET /api/complaints/complaint/IIITN-timestamp-xxxx
```

**Admin Login:**
```bash
POST /api/admin/login
{
  "email": "admin@iiitn.ac.in",
  "password": "Admin123!"
}
```

**Update Complaint (Admin):**
```bash
PUT /api/complaints/IIITN-timestamp-xxxx
Header: Authorization: Bearer {token}
{
  "status": "In Progress",
  "adminNotes": "Working on it"
}
```

### 🎨 Color Codes

```css
--primary-color: #2e5090     /* Dark Blue */
--secondary-color: #00b4d8   /* Cyan */
--accent-color: #ff006e      /* Pink */
--success-color: #28a745     /* Green */
--warning-color: #ffc107     /* Yellow */
--danger-color: #dc3545      /* Red */
--light-bg: #f8f9ff          /* Light Background */
```

### 📦 Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostelflow
JWT_SECRET=your_secret_key
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

### 🐛 Common Issues & Fixes

**Issue: Backend won't start**
```
✅ Check: MongoDB is running
✅ Fix: Change port in .env if 5000 is in use
✅ Fix: Delete node_modules & reinstall
```

**Issue: Frontend can't connect to backend**
```
✅ Fix: Verify VITE_API_URL in .env
✅ Fix: Check CORS is enabled in server.js
✅ Fix: Restart both servers
```

**Issue: Complaints not saving**
```
✅ Fix: Ensure MongoDB connection is working
✅ Fix: Check backend console for errors
✅ Fix: Verify required fields are filled
```

**Issue: Admin login fails**
```
✅ Fix: Verify credentials are correct
✅ Fix: Check if admin account exists
✅ Fix: Seed admin account if needed
```

### 🔄 Common Commands

```bash
# Backend
npm run dev              # Start development server
npm start               # Start production server

# Frontend  
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Check code quality

# Both
npm install             # Install dependencies
npm list                # Show installed packages
npm update              # Update packages
npm cache clean --force # Clear npm cache
```

### 📱 Screen Sizes

```
Mobile:  < 768px   (single column)
Tablet:  768-1024px (two columns)
Desktop: > 1024px  (full layout)
```

### 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Generate strong JWT secret
- [ ] Use hashed passwords
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Implement logging

### 📊 Database Schema

**Complaint Model:**
```
- complaintId (unique)
- studentName
- studentRoll
- hostel
- room
- email
- phone
- category
- description
- priority (Low/Medium/High)
- status (Submitted/Acknowledged/In Progress/Resolved/Rejected)
- adminNotes
- resolvedAt
- createdAt
- updatedAt
```

**Admin Model:**
```
- email (unique)
- password (hashed)
- name
- role (admin/superadmin)
- department
- isActive
- createdAt
```

### 🎯 Complaint Categories

| Category | Icon | Color |
|----------|------|-------|
| Electricity | ⚡ | #fff3e0 |
| Water | 💧 | #e1f5fe |
| Cleaning | 🧹 | #f3e5f5 |
| Internet | 📶 | #e8f5e9 |
| Other | 🔧 | #fce4ec |

### 📈 Priority Levels

| Priority | Color | Trigger Words |
|----------|-------|---|
| High | Red (#dc3545) | urgent, danger, fire, electric emergency |
| Medium | Yellow (#ff9800) | water, internet, clean issue |
| Low | Green (#28a745) | default, minor |

### 🚀 Deployment Checklist

**Before Deployment:**
- [ ] Update environment variables
- [ ] Change default passwords
- [ ] Generate secure JWT secret
- [ ] Configure MongoDB Atlas/Cloud
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Build frontend: `npm run build`
- [ ] Test all APIs
- [ ] Enable CORS for production domain
- [ ] Set up monitoring
- [ ] Create backups

### 📞 Support Resources

- MongoDB: https://docs.mongodb.com/
- Express: https://expressjs.com/
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Mongoose: https://mongoosejs.com/

### 🎨 Animation Classes

```css
fadeIn           /* Smooth fade in */
slideIn          /* Slide from left */
pulse            /* Pulsing effect */
bounce           /* Bouncing animation */
rotate           /* Rotation animation */
```

### 📝 File Organization

```
Keep code organized:
- One component per file
- Group related functions
- Use meaningful names
- Add comments for complex logic
- Keep CSS in separate files
```

### ✅ Testing Workflow

1. Test frontend UI locally
2. Test API endpoints with Postman
3. Test MongoDB queries
4. Test authentication flow
5. Test data persistence
6. Test responsive design
7. Check console for errors
8. Verify all status updates

---

**📖 Full Documentation:** See SETUP_GUIDE.md for detailed instructions
**🆘 Issues?** Check MongoDB setup or contact admin
**🚀 Ready to deploy?** See deployment section in SETUP_GUIDE.md
