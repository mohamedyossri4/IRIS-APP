@echo off
echo ========================================
echo Creating Admin User
echo ========================================
echo.

timeout /t 2 /nobreak > nul

curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\",\"fullName\":\"Administrator\"}"

echo.
echo.
echo ========================================
echo Admin user created!
echo Username: admin
echo Password: admin123
echo ========================================
echo.
echo Access the application at: http://localhost:4200
echo.
pause
