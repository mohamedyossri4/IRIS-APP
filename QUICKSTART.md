# Quick Start Guide

## 🚀 Start the Application

### Option 1: Using the start script (Recommended)
```bash
.\start.bat
```

### Option 2: Manual start
```bash
docker-compose down
docker-compose up --build
```

## ⏱️ Wait for Services

The application takes 5-10 minutes to start on first run. Watch for:

1. **Oracle DB**: "DATABASE IS READY TO USE" 
2. **Backend**: "Nest application successfully started"
3. **Frontend**: "Compiled successfully"

## 👤 Create Admin User

Once all services are running, in a **new terminal**:

```bash
.\create-admin.bat
```

Or manually:
```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\",\"fullName\":\"Administrator\"}"
```

## 🌐 Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000

**Login with:**
- Username: `admin`
- Password: `admin123`

## 🛑 Stop the Application

Press `Ctrl+C` in the terminal, then:
```bash
docker-compose down
```

## 🔍 Troubleshooting

### Check service status
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f oracle-db
```

### Common Issues

**Port already in use:**
- Stop other services using ports 1521, 3000, or 4200
- Or change ports in `docker-compose.yml`

**Database not ready:**
- Wait longer (first run takes 5-10 minutes)
- Check logs: `docker-compose logs oracle-db`

**Backend connection error:**
- Ensure database is fully started
- Check logs: `docker-compose logs backend`

**Frontend not loading:**
- Check if backend is running
- Check logs: `docker-compose logs frontend`

## 📝 Notes

- Development mode with hot reload enabled
- Code changes will automatically rebuild
- Database data persists in Docker volume
- Frontend runs on port 4200 (not 80) in dev mode
