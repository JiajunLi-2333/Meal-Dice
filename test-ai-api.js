// 测试AI API的简单脚本 - 使用WSL2 Ollama在11435端口

async function testAIAPI() {
    try {
        console.log('🧑‍🍳 Testing AI Recipe Suggestion API with WSL2 Ollama on port 11435...');
        
        // 首先测试Ollama连接
        console.log('🔍 Testing Ollama connection...');
        try {
            const ollamaResponse = await fetch('http://localhost:11435/api/version');
            const ollamaData = await ollamaResponse.text();
            console.log('✅ Ollama is running on port 11435:', ollamaData);
        } catch (ollamaErr) {
            console.log('❌ Ollama is not accessible on port 11435');
            console.log('💡 Please run: ./start-ollama-wsl2.sh');
            return;
        }
        
        const testData = {
            ingredients: ['tomato', 'onion', 'garlic', 'rice']
        };
        
        console.log('🔄 Sending request to AI API...');
        
        const response = await fetch('http://localhost:3001/api/suggest-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        
        console.log('📊 API Response Status:', response.status);
        console.log('='.repeat(50));
        
        if (result.success) {
            console.log('✅ AI API is working correctly!');
            console.log('🍴 Suggested Recipe:', result.suggestion.title);
            console.log('🥗 Ingredients:', result.suggestion.ingredients.join(', '));
            console.log('⏱️ Cooking Time:', result.suggestion.cookingTime);
            console.log('🌱 Waste Reduction:', result.suggestion.wasteReduction);
            console.log('📝 Instructions:', result.suggestion.instructions.substring(0, 100) + '...');
        } else {
            console.log('❌ API returned an error:', result.error);
            
            if (result.error.includes('Ollama')) {
                console.log('💡 Make sure Ollama is running: ./start-ollama-wsl2.sh');
                console.log('💡 And the project is using OLLAMA_PORT=11435');
            }
        }
        
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 Server is not running. Start it with: ./start-project.sh');
        }
    }
}

// 检查环境
function checkEnvironment() {
    console.log('🔍 Environment Check:');
    console.log('Node.js version:', process.version);
    
    // 检查是否支持fetch
    if (typeof fetch === 'undefined') {
        console.log('⚠️  fetch not available, trying to import...');
        try {
            global.fetch = require('node-fetch');
            console.log('✅ node-fetch imported successfully');
        } catch (err) {
            console.error('❌ Please install node-fetch: npm install node-fetch');
            return false;
        }
    } else {
        console.log('✅ fetch is available');
    }
    
    return true;
}

// 运行测试
if (checkEnvironment()) {
    console.log('🚀 Starting API test...');
    testAIAPI();
} else {
    console.log('❌ Environment check failed');
}
