// 测试不同端口的Ollama连接
async function testOllamaConnection() {
    console.log('🔍 Testing Ollama connection...');
    
    const testPorts = ['11434', '11435'];
    
    for (const port of testPorts) {
        const url = `http://localhost:${port}/api/version`;
        console.log(`\n🔗 Testing port ${port}: ${url}`);
        
        try {
            const response = await fetch(url);
            const data = await response.text();
            console.log(`✅ Port ${port} is working! Response:`, data);
            
            // 测试模型列表
            try {
                const modelsResponse = await fetch(`http://localhost:${port}/api/tags`);
                const modelsData = await modelsResponse.json();
                console.log(`📚 Available models on port ${port}:`, modelsData.models?.map(m => m.name) || 'None');
            } catch (err) {
                console.log(`⚠️  Could not fetch models: ${err.message}`);
            }
            
            return port;
        } catch (error) {
            console.log(`❌ Port ${port} failed:`, error.message);
        }
    }
    
    console.log('\n💡 No Ollama service found on common ports');
    return null;
}

// 检查环境
if (typeof fetch === 'undefined') {
    try {
        global.fetch = require('node-fetch');
    } catch (err) {
        console.error('❌ Please install node-fetch or use Node 18+');
        process.exit(1);
    }
}

testOllamaConnection();
