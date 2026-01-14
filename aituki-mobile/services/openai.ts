import Constants from 'expo-constants';

// Get OpenAI API key from environment
const getEnvVar = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key] || 
                process.env[key] || 
                '';
  
  // Log for debugging (only in development)
  if (__DEV__) {
    console.log(`getEnvVar(${key}):`, { 
      hasValue: !!value, 
      valueLength: value?.length || 0,
      hasConstants: !!Constants.expoConfig?.extra,
      hasProcessEnv: !!process.env[key]
    });
  }
  
  return value;
};

const OPENAI_API_KEY = getEnvVar('EXPO_PUBLIC_OPENAI_API_KEY');

// Log API key status (without exposing the actual key)
console.log('OpenAI Service initialized', { 
  hasApiKey: !!OPENAI_API_KEY, 
  apiKeyLength: OPENAI_API_KEY?.length || 0,
  keyPrefix: OPENAI_API_KEY?.substring(0, 7) || 'none',
  hasConstantsConfig: !!Constants.expoConfig?.extra,
  constantsKeys: Constants.expoConfig?.extra ? Object.keys(Constants.expoConfig.extra) : []
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send a message to OpenAI and get a response
 * @param messages Array of chat messages (conversation history)
 * @param systemPrompt Optional system prompt to set AI behavior
 * @returns The assistant's response message
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  console.log('sendChatMessage: Starting', { 
    hasApiKey: !!OPENAI_API_KEY, 
    apiKeyLength: OPENAI_API_KEY?.length || 0,
    messageCount: messages.length 
  });

  if (!OPENAI_API_KEY) {
    console.error('sendChatMessage: API key is missing');
    throw new Error(
      'OpenAI API key is not configured. Please add EXPO_PUBLIC_OPENAI_API_KEY to your environment variables.'
    );
  }

  // Prepare messages with optional system prompt
  const apiMessages: ChatMessage[] = [];
  if (systemPrompt) {
    apiMessages.push({ role: 'system', content: systemPrompt });
  }
  apiMessages.push(...messages);

  console.log('sendChatMessage: Making API request', { 
    model: 'gpt-4o-mini',
    messageCount: apiMessages.length 
  });

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using GPT-4o-mini for cost-effectiveness, can change to gpt-4o for better quality
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('sendChatMessage: Response status', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('sendChatMessage: API error', errorData);
      throw new Error(
        errorData.error?.message || 
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data: ChatCompletionResponse = await response.json();
    console.log('sendChatMessage: Response received', { 
      hasChoices: !!data.choices, 
      choiceCount: data.choices?.length || 0 
    });
    
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content.trim();
      console.log('sendChatMessage: Success', { contentLength: content.length });
      return content;
    } else {
      console.error('sendChatMessage: No choices in response', data);
      throw new Error('No response from OpenAI');
    }
  } catch (error) {
    console.error('sendChatMessage: Exception caught', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your internet connection and try again');
      }
      throw error;
    }
    throw new Error('Failed to communicate with OpenAI API');
  }
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!OPENAI_API_KEY;
}

