// 临时修复：让项目连接到Windows的Ollama
const { execSync } = require('child_process');

// 获取Windows主机IP
function getWindowsHostIP() {
    try {
        const hostIp = execSync('cat /etc/resolv.conf | grep nameserver | cut -d " " -f 2', 
            { encoding: 'utf8' }).trim();
        return hostIp;
    } catch (error) {
        return 'localhost';
    }
}

const windowsIP = getWindowsHostIP();
console.log('🔗 Windows Host IP:', windowsIP);

// 测试不同的Ollama连接选项
async function testOllamaConnections() {
    const connections = [
        { name: 'WSL2 Ollama (11435)', url: 'http://localhost:11435' },
        { name: 'Windows Ollama (11434)', url: `http://${windowsIP}:11434` },
        { name: 'Localhost Ollama (11434)', url: 'http://localhost:11434' }
    ];
    
    console.log('🔍 Testing Ollama connections...');
    
    for (const conn of connections) {
        try {
            console.log(`\n📡 Testing ${conn.name}...`);
            
            const response = await fetch(`${conn.url}/api/version`);
            const data = await response.text();
            
            console.log(`✅ ${conn.name} is working!`);
            console.log(`📊 Response: ${data}`);
            
            // 返回工作的连接
            return conn.url;
            
        } catch (error) {
            console.log(`❌ ${conn.name} failed: ${error.message}`);
        }
    }
    
    console.log('\n❌ No working Ollama connection found!');
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

testOllamaConnections();
