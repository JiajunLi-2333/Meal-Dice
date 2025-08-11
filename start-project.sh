#!/bin/bash
# 项目启动脚本 - 使用WSL2 Ollama

echo "🍽️  Starting Meal Dice with WSL2 Ollama..."

# 设置环境变量
export OLLAMA_PORT=11435

# 检查Ollama是否在11435端口运行
if ! curl -s http://localhost:11435/api/version > /dev/null; then
    echo "❌ Ollama is not running on port 11435"
    echo "💡 Please run: ./start-ollama-wsl2.sh first"
    exit 1
fi

echo "✅ Ollama detected on port 11435"

# 检查是否有模型
echo "🔍 Checking for available models..."
model_count=$(curl -s http://localhost:11435/api/tags | grep -o '"models":\[' | wc -l)

if [ "$model_count" -eq 0 ]; then
    echo "⚠️  No models found. Downloading llama3.2:3b..."
    OLLAMA_HOST=localhost:11435 ollama pull llama3.2:3b
fi

echo "🚀 Starting Node.js server..."
npm run server
