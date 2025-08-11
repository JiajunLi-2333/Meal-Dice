#!/bin/bash
# WSL2 Ollama 启动脚本

echo "🚀 Starting Ollama on port 11435..."

# 检查11435端口是否可用
if sudo lsof -i :11435 > /dev/null 2>&1; then
    echo "⚠️  Port 11435 is already in use"
    sudo lsof -i :11435
    exit 1
fi

# 启动Ollama
echo "🤖 Starting Ollama server..."
OLLAMA_HOST=0.0.0.0:11435 ollama serve &

# 等待服务启动
echo "⏳ Waiting for Ollama to start..."
sleep 5

# 测试连接
echo "🔍 Testing connection..."
if curl -s http://localhost:11435/api/version > /dev/null; then
    echo "✅ Ollama is running on port 11435"
    
    # 检查是否有模型
    echo "📚 Checking available models..."
    ollama list
    
    echo ""
    echo "💡 To download a model (if none available):"
    echo "   OLLAMA_HOST=localhost:11435 ollama pull llama3.2:3b"
    echo ""
    echo "🎯 To start your project:"
    echo "   export OLLAMA_PORT=11435"
    echo "   npm run server"
    
else
    echo "❌ Failed to start Ollama"
    exit 1
fi
