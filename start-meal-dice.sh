#!/bin/bash
# 快速启动脚本 - 确保端口匹配

echo "🔧 Starting Meal Dice with correct Ollama configuration..."

# 检查Ollama是否在11435端口运行
echo "🔍 Checking Ollama on port 11435..."
if curl -s http://localhost:11435/api/version > /dev/null; then
    echo "✅ Ollama is running on port 11435"
    
    # 检查模型
    echo "📚 Checking llama3.2:3b model..."
    if OLLAMA_HOST=localhost:11435 ollama list | grep -q "llama3.2:3b"; then
        echo "✅ llama3.2:3b model is available"
        
        # 设置正确的环境变量并启动服务器
        echo "🚀 Starting Node.js server with OLLAMA_PORT=11435..."
        export OLLAMA_PORT=11435
        npm run server
        
    else
        echo "❌ llama3.2:3b model not found"
        echo "💡 Please download it: OLLAMA_HOST=localhost:11435 ollama pull llama3.2:3b"
        exit 1
    fi
    
else
    echo "❌ Ollama is not running on port 11435"
    echo "💡 Please start Ollama: OLLAMA_HOST=localhost:11435 ollama serve"
    exit 1
fi
