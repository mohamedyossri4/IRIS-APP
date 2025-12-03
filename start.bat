@echo off
echo ========================================
echo IRIS-APP Docker Deployment
echo ========================================
echo.

echo Stopping any existing containers...
docker-compose down

echo.
echo Building and starting services...
echo This may take 5-10 minutes on first run.
echo.

docker-compose up --build

echo.
echo ========================================
echo Deployment stopped
echo ========================================
