import Constants from 'expo-constants';
import { generateHealthContext, formatHealthContextForAI, HealthContext } from './aiHealthContext';

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
 * Get health context for the current user
 * Cached for performance (context is regenerated if older than 5 minutes)
 */
let cachedHealthContext: { context: HealthContext | null; timestamp: number } | null = null;
const HEALTH_CONTEXT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getHealthContext(userId?: string): Promise<string | null> {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedHealthContext && (now - cachedHealthContext.timestamp) < HEALTH_CONTEXT_CACHE_TTL) {
      if (cachedHealthContext.context) {
        return formatHealthContextForAI(cachedHealthContext.context);
      }
      return null;
    }

    // Generate new context
    const context = await generateHealthContext(userId);
    
    // Update cache
    cachedHealthContext = {
      context,
      timestamp: now,
    };

    if (context) {
      return formatHealthContextForAI(context);
    }

    return null;
  } catch (error) {
    console.error('Error getting health context:', error);
    return null;
  }
}

/**
 * Clear health context cache (useful after syncing new data)
 */
export function clearHealthContextCache(): void {
  cachedHealthContext = null;
}

/**
 * Send a message to OpenAI and get a response
 * @param messages Array of chat messages (conversation history)
 * @param systemPrompt Optional system prompt to set AI behavior
 * @param includeHealthContext Whether to include user's health data in context (default: true)
 * @param userId Optional user ID for health context (uses current session if not provided)
 * @returns The assistant's response message
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  systemPrompt?: string,
  includeHealthContext: boolean = true,
  userId?: string
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

  // Get health context if requested
  let healthContextString: string | null = null;
  if (includeHealthContext) {
    try {
      healthContextString = await getHealthContext(userId);
    } catch (error) {
      console.warn('Failed to get health context, continuing without it:', error);
    }
  }

  // Build enhanced system prompt with health context
  let enhancedSystemPrompt = systemPrompt || '';
  
  if (healthContextString) {
    const healthContextSection = `\n\nYou have access to the user's health data. Use this information to provide personalized, empathetic, and relevant advice. Consider all four pillars of wellbeing: Physical, Emotional, Mental, and Energy.\n\n${healthContextString}\n\nWhen responding, be empathetic and supportive. Reference specific health metrics when relevant, but don't overwhelm the user with numbers. Focus on actionable insights and encouragement.`;
    
    if (enhancedSystemPrompt) {
      enhancedSystemPrompt += healthContextSection;
    } else {
      enhancedSystemPrompt = `You are AiTuki, a compassionate AI health and wellbeing assistant. Your role is to help users improve their health across four pillars: Physical, Emotional, Mental, and Energy.${healthContextSection}`;
    }
  } else if (!enhancedSystemPrompt) {
    enhancedSystemPrompt = 'You are AiTuki, a compassionate AI health and wellbeing assistant. Your role is to help users improve their health across four pillars: Physical, Emotional, Mental, and Energy.';
  }

  // Prepare messages with enhanced system prompt
  const apiMessages: ChatMessage[] = [];
  if (enhancedSystemPrompt) {
    apiMessages.push({ role: 'system', content: enhancedSystemPrompt });
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

