// Test your OpenAI API key
async function testAPIKey() {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ API key is working correctly!');
      const data = await response.json();
      console.log(`Found ${data.data.length} available models`);
    } else {
      console.log('❌ API key test failed');
      console.log('Status:', response.status);
      console.log('Error:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error testing API key:', error.message);
  }
}

testAPIKey();
