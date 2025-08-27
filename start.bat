@echo off
chcp 65001 >nul
cls
echo ========================================
echo     启明星平台 - 开发服务器启动脚本
echo ========================================
echo.

echo 正在检查 Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js，请先安装 Node.js
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node --version

echo.
echo 正在检查项目依赖...
if not exist node_modules (
    echo 📦 首次运行，正在安装依赖包...
    echo 这可能需要几分钟时间，请耐心等待...
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ 依赖安装失败，尝试清理缓存...
        npm cache clean --force
        echo 重新安装...
        npm install
    )
) else (
    echo ✅ 依赖包已存在
)

echo.
echo 🚀 启动开发服务器...
echo.
echo 尝试端口 3001...
start "" "http://localhost:3001"
npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  端口 3001 启动失败，尝试端口 3002...
    start "" "http://localhost:3002"
    npm run dev:3002
    
    if %errorlevel% neq 0 (
        echo.
        echo ⚠️  端口 3002 启动失败，尝试端口 3003...
        start "" "http://localhost:3003"
        npm run dev:3003
    )
)

echo.
echo 按任意键退出...
pause >nul