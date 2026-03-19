import fetch from 'node-fetch';

// 测试后端API
async function testBackendAPI() {
  const apiBase = 'https://my-portfolio-production-2992.up.railway.app/api';
  
  console.log('Testing backend API...');
  console.log(`API Base: ${apiBase}`);
  
  try {
    // 测试健康检查端点
    console.log('\nTesting health endpoint...');
    const healthResponse = await fetch('https://my-portfolio-production-2992.up.railway.app/health');
    console.log(`Health status: ${healthResponse.status}`);
    const healthData = await healthResponse.text();
    console.log(`Health response: ${healthData.substring(0, 100)}...`);
    
    // 测试注册端点
    console.log('\nTesting register endpoint...');
    const registerResponse = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });
    
    console.log(`Register status: ${registerResponse.status}`);
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('Register response:', registerData);
    } else {
      const errorData = await registerResponse.text();
      console.log('Register error:', errorData);
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testBackendAPI();
