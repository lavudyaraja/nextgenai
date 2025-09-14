#!/usr/bin/env tsx

import OpenAI from 'openai';

async function testOpenAIModels() {
  console.log('Testing OpenAI API and models...');
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
    console.error('❌ OpenAI API key not configured');
    process.exit(1);
  }
  
  console.log('✅ API key found:', apiKey.substring(0, 10) + '...');
  
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.openai.com/v1"
  });

  try {
    console.log('\n📋 Testing available models...');
    
    // Try to list models
    const models = await openai.models.list();
    console.log('✅ Successfully connected to OpenAI API');
    
    // Filter for chat models
    const chatModels = models.data
      .filter(model => 
        model.id.includes('gpt') && 
        !model.id.includes('instruct') && 
        !model.id.includes('edit') &&
        !model.id.includes('embedding')
      )
      .map(model => model.id)
      .sort();
    
    console.log('\n🤖 Available GPT Chat Models:');
    chatModels.forEach(model => {
      console.log(`  - ${model}`);
    });
    
    // Test specific models
    const modelsToTest = [
      'gpt-3.5-turbo',
      'gpt-4',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4-turbo-preview'
    ];
    
    console.log('\n🧪 Testing specific models with a simple request...');
    
    for (const model of modelsToTest) {
      try {
        console.log(`\nTesting ${model}...`);
        
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: 'Say "Hello, this is a test!" and nothing else.'
            }
          ],
          max_tokens: 20,
          temperature: 0
        });
        
        const response = completion.choices[0]?.message?.content;
        console.log(`✅ ${model}: ${response}`);
        
      } catch (error: any) {
        if (error?.status === 404) {
          console.log(`❌ ${model}: Model not found or not accessible`);
        } else if (error?.status === 401) {
          console.log(`🔒 ${model}: Unauthorized - check API key permissions`);
        } else if (error?.status === 403) {
          console.log(`🚫 ${model}: Forbidden - insufficient permissions`);
        } else if (error?.status === 429) {
          console.log(`⏳ ${model}: Rate limited`);
        } else {
          console.log(`❌ ${model}: Error - ${error?.message || 'Unknown error'}`);
        }
      }
    }
    
  } catch (error: any) {
    console.error('❌ Failed to connect to OpenAI API:', error?.message || error);
    
    if (error?.status === 401) {
      console.error('🔑 Invalid API key. Please check your OPENAI_API_KEY');
    } else if (error?.status === 403) {
      console.error('🚫 Access forbidden. Check your API key permissions');
    } else if (error?.code === 'ENOTFOUND') {
      console.error('🌐 Network error. Check your internet connection');
    }
    
    process.exit(1);
  }
}

// Run the test
testOpenAIModels().catch(console.error);