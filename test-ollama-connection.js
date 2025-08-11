// 测试WSL2到Windows Ollama连接
const { execSync } = require('child_process');

async function testOllamaConnection() {
    console.log('🔍 Testing Ollama connection from WSL2...');
    
    // 获取Windows主机IP
    try {
        const hostIp = execSync('cat /etc/resolv.conf | grep nameserver | cut -d " " -f 2', 
            { encoding: 'utf8' }).trim();
        console.log('🌐 Windows host IP:', hostIp);
        
        // 测试连接
        const testUrls = [
            `http://${hostIp}:11434/api/version`,
            'http://localhost:11434/api/version'
        ];
        
        for (const url of testUrls) {
            console.log(`\n🔗 Testing: ${url}`);
            try {
                const response = await fetch(url);
                const data = await response.text();
                console.log('✅ Success! Response:', data);
                return url;
            } catch (error) {
                console.log('❌ Failed:', error.message);
            }
        }
        
        console.log('\n💡 Solutions to try:');
        console.log('1. Make sure Ollama is running on Windows: ollama serve');
        console.log('2. Check Windows Firewall settings');
        console.log('3. Try running from Windows terminal instead of WSL2');
        
    } catch (error) {
        console.error('❌ Error getting host IP:', error.message);
    }
}

// 检查环境
function checkEnvironment() {
    if (typeof fetch === 'undefined') {
        try {
            global.fetch = require('node-fetch');
        } catch (err) {
            console.error('❌ Please install node-fetch: npm install node-fetch');
            return false;
        }
    }
    return true;
}

if (checkEnvironment()) {
    testOllamaConnection();
}
