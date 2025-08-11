#!/bin/bash

echo "🔍 检查后端服务器状态..."

# 检查3001端口是否被占用
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ 端口3001正在被使用"
    echo "进程信息:"
    lsof -Pi :3001 -sTCP:LISTEN
else
    echo "❌ 端口3001没有被占用 - 服务器可能没有启动"
fi

echo ""
echo "🌐 测试API连接..."
curl -s http://localhost:3001/api/health || echo "❌ 无法连接到API服务器"