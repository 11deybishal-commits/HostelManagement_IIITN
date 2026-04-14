## MongoDB Setup Guide for HostelFlow

### Option 1: Local MongoDB Installation

#### Windows:
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Install as a Service" for easy startup
4. Default path: `C:\Program Files\MongoDB\Server\VERSION\bin\mongod.exe`
5. Start MongoDB:
   ```bash
   mongod
   ```

#### macOS:
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### Linux (Ubuntu):
```bash
# Add MongoDB repository
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)

**Recommended for Production**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project
4. Build a cluster (free tier available)
5. Create a database user
6. Get connection string
7. Use the connection string in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostelflow
   ```

### Option 3: Docker

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB in a container
docker run -d -p 27017:27017 --name hostelflow-mongo mongo

# Connect using
# MONGODB_URI=mongodb://localhost:27017/hostelflow
```

### Verify MongoDB Connection

1. Open MongoDB shell:
   ```bash
   mongosh
   # or older versions
   mongo
   ```

2. Show databases:
   ```javascript
   show databases;
   ```

3. Switch to hostelflow database:
   ```javascript
   use hostelflow;
   ```

4. Check collections:
   ```javascript
   show collections;
   ```

### Troubleshooting

**MongoDB won't start:**
- Check if port 27017 is in use
- Verify install path
- Check Windows Services if installed as service

**Connection refused:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify firewall settings

**Atlas Connection Issues:**
- Whitelist your IP address in Atlas dashboard
- Verify database user credentials
- Check connection string format

### Database Initialization

The first time you run HostelFlow:

1. Start the backend: `npm run dev` in backend folder
2. Collection indexes will be created automatically
3. You can optionally seed admin account using the provided seed script

### Backup and Restore

**Backup:**
```bash
mongodump --uri "mongodb://localhost:27017/hostelflow" --out ./backup
```

**Restore:**
```bash
mongorestore --uri "mongodb://localhost:27017/hostelflow" ./backup/hostelflow
```

### Production Recommendations

1. Use MongoDB Atlas for production
2. Enable authentication
3. Use strong passwords
4. Enable SSL/TLS
5. Regular backups
6. Monitor database performance
7. Use connection pooling
8. Implement data validation

### Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Atlas Documentation: https://docs.atlas.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/

---

**Need Help?** Contact MongoDB support or check the official documentation.
