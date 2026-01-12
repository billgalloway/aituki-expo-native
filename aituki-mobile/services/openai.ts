import Constants from 'expo-constants';

// Get OpenAI API key from environment
const getEnvVar = (key: string): string => {
  return Constants.expoConfig?.extra?.[key] || 
         process.env[key] || 
         '';
};

const OPENAI_API_KEY = getEnvVar('EXPO_PUBLIC_OPENAI_API_KEY');

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
  if (!OPENAI_API_KEY) {
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

  try {
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
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data: ChatCompletionResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('No response from OpenAI');
    }
  } catch (error) {
    if (error instanceof Error) {
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

