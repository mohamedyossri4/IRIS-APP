# IRIS-APP Docker Deployment Guide

## Quick Start

### 1. Prerequisites
- Docker Desktop installed and running
- At least 8GB RAM available
- Ports 80, 3000, and 1521 available

### 2. Deploy the Application

```bash
# From the project root directory
docker-compose up --build
```

This will:
- Build the backend (NestJS)
- Build the frontend (Angular)
- Start Oracle Database
- Configure networking between services

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Oracle Database**: localhost:1521

### 4. Initial Setup

**Create a user account:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","fullName":"Administrator"}'
```

**Login:**
- Navigate to http://localhost
- Username: `admin`
- Password: `admin123`

## Services

### Oracle Database
- **Container**: iris-oracle-db
- **Port**: 1521
- **Service Name**: XEPDB1
- **Password**: YourStrongPassword123
- **Data**: Persisted in Docker volume `oracle-data`

### Backend (NestJS)
- **Container**: iris-backend
- **Port**: 3000
- **Health Check**: http://localhost:3000/

### Frontend (Angular + Nginx)
- **Container**: iris-frontend
- **Port**: 80
- **Serves**: Production-built Angular app
- **Proxy**: API requests to backend

## Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f oracle-db
```

### Rebuild Services
```bash
# Rebuild all
docker-compose up --build

# Rebuild specific service
docker-compose up --build backend
```

### Check Service Status
```bash
docker-compose ps
```

### Access Container Shell
```bash
# Backend
docker exec -it iris-backend sh

# Frontend
docker exec -it iris-frontend sh

# Database
docker exec -it iris-oracle-db bash
```

## Environment Variables

### Backend (.env)
Create `backend/.env` file:
```env
DB_HOST=oracle-db
DB_PORT=1521
DB_USER=system
DB_PASSWORD=YourStrongPassword123
DB_SERVICE=XEPDB1
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## Production Deployment

### Security Considerations
1. **Change default passwords**:
   - Oracle database password
   - JWT secret key

2. **Use environment files**:
   ```bash
   docker-compose --env-file .env.production up -d
   ```

3. **Enable HTTPS**:
   - Add SSL certificates
   - Configure nginx for HTTPS
   - Update docker-compose ports

### Scaling
```bash
# Scale backend instances
docker-compose up -d --scale backend=3
```

### Backup Database
```bash
# Create backup
docker exec iris-oracle-db sh -c 'expdp system/YourStrongPassword123@XEPDB1 full=y directory=DATA_PUMP_DIR dumpfile=backup.dmp'

# Copy backup to host
docker cp iris-oracle-db:/opt/oracle/admin/XE/dpdump/backup.dmp ./backup.dmp
```

## Troubleshooting

### Database Connection Issues
```bash
# Check database is ready
docker-compose logs oracle-db

# Wait for database initialization (first run takes 5-10 minutes)
docker-compose logs -f oracle-db | grep "DATABASE IS READY TO USE"
```

### Backend Not Starting
```bash
# Check logs
docker-compose logs backend

# Verify database connection
docker exec -it iris-backend sh
npm run start:dev
```

### Frontend Not Loading
```bash
# Check nginx logs
docker-compose logs frontend

# Verify build
docker exec -it iris-frontend ls /usr/share/nginx/html
```

### Port Conflicts
```bash
# Change ports in docker-compose.yml
# Frontend: "8080:80"
# Backend: "3001:3000"
```

## Maintenance

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Clean Up
```bash
# Remove containers and networks
docker-compose down

# Remove volumes (WARNING: deletes database data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

### Monitor Resources
```bash
# View resource usage
docker stats
```

## Network Architecture

```
┌─────────────────────────────────────────┐
│  Host Machine                           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  iris-network (bridge)            │ │
│  │                                   │ │
│  │  ┌──────────┐  ┌──────────┐     │ │
│  │  │ Frontend │  │ Backend  │     │ │
│  │  │  :80     │─▶│  :3000   │     │ │
│  │  └──────────┘  └────┬─────┘     │ │
│  │                     │            │ │
│  │                     ▼            │ │
│  │              ┌──────────┐       │ │
│  │              │ Oracle   │       │ │
│  │              │  :1521   │       │ │
│  │              └──────────┘       │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Health Checks

All services include health checks:
- **Backend**: HTTP check on port 3000
- **Frontend**: HTTP check on port 80
- **Database**: SQL connection check

View health status:
```bash
docker-compose ps
```

## Performance Tips

1. **Increase Docker resources**:
   - Docker Desktop → Settings → Resources
   - Recommended: 4 CPUs, 8GB RAM

2. **Use production builds**:
   - Frontend: Already optimized with nginx
   - Backend: Uses compiled JavaScript

3. **Enable caching**:
   - Frontend static assets cached for 1 year
   - API responses can be cached with Redis (optional)

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify all services are healthy: `docker-compose ps`
3. Ensure ports are not in use: `netstat -an | findstr "80 3000 1521"`
