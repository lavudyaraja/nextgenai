# Environment Variables for AI Services

This project supports multiple AI providers. Configure the appropriate API keys for the services you want to use:

## OpenAI (GPT)
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

## Google Gemini
```
GEMINI_API_KEY=your-gemini-api-key-here
```

## Anthropic Claude
```
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
```

## X.AI Grok
```
XAI_API_KEY=your-xai-api-key-here
```

## Other Required Variables
```
DATABASE_URL=your-database-connection-string
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## How to Get API Keys

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your environment variables

### Google Gemini
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Add it to your environment variables

### Anthropic Claude
1. Go to https://console.anthropic.com/
2. Create a new API key
3. Add it to your environment variables

### X.AI Grok
1. Go to https://console.x.ai/
2. Create a new API key
3. Add it to your environment variables

## Model Selection in UI

The chat interface now supports switching between different AI models:
- **GPT**: Uses OpenAI's GPT models
- **Gemini**: Uses Google's Gemini Pro model
- **Claude**: Uses Anthropic's Claude 3 Haiku model
- **Grok**: Uses X.AI's Grok Beta model

Simply select the desired model from the dropdown in the chat interface, and the system will automatically route your requests to the appropriate AI service.