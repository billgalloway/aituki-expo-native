/**
 * Chat Interface Component
 * Displays chat messages and handles user input for AI conversations
 * Updated to match Figma design
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { sendChatMessage, ChatMessage, isOpenAIConfigured } from '@/services/openai';

interface ChatInterfaceProps {
  systemPrompt?: string;
  placeholder?: string;
  onError?: (error: string) => void;
  onMessagesChange?: (messageCount: number) => void;
}

export default function ChatInterface({
  systemPrompt = "You are a helpful AI assistant that provides personalized health and wellness guidance. Be friendly, supportive, and concise.",
  placeholder = "Ask me anything",
  onError,
  onMessagesChange,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Notify parent when messages change
  useEffect(() => {
    onMessagesChange?.(messages.length);
  }, [messages.length, onMessagesChange]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    if (!isOpenAIConfigured()) {
      const errorMsg = 'OpenAI API key is not configured. Please add your API key to app.json.';
      Alert.alert('Configuration Error', errorMsg);
      onError?.(errorMsg);
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputText.trim(),
    };

    // Add user message to chat
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const assistantResponse = await sendChatMessage(newMessages, systemPrompt);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse,
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      Alert.alert('Error', errorMessage);
      onError?.(errorMessage);
      // Remove the user message if there was an error
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setMessages([]),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {/* Messages Container */}
      {messages.length > 0 || isLoading ? (
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}>
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}>
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userText : styles.assistantText,
                  ]}>
                  {message.content}
                </Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageContainer, styles.assistantMessage]}>
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <ActivityIndicator size="small" color={Colors.light.textSecondary} />
              </View>
            </View>
          )}
        </ScrollView>
      ) : null}

      {/* Input Container - Matching Figma Design */}
      <View style={styles.chatInputContainer}>
        <View style={styles.chatInputWrapper}>
          {/* Text Input Area */}
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={placeholder}
            placeholderTextColor="rgba(31,86,97,0.6)"
            multiline
            maxLength={500}
            editable={!isLoading}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            textAlignVertical="top"
          />
          
          {/* Bottom row with icons */}
          <View style={styles.inputRow}>
            {/* Left icons: plus, language, attachment */}
            <View style={styles.leftIcons}>
              <TouchableOpacity 
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconLibrary iconName="add" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconLibrary iconName="language" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconLibrary iconName="attachment" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* Right side: voice icon and send button */}
            <View style={styles.rightIcons}>
              <TouchableOpacity 
                style={styles.voiceButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconLibrary iconName="mic" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <IconLibrary iconName="send" size={24} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Clear chat button (when messages exist) */}
        {messages.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearChat}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <IconLibrary iconName="refresh" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  messagesContainer: {
    maxHeight: 200, // Limit max height so it doesn't expand unnecessarily
  },
  messagesContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userBubble: {
    backgroundColor: Colors.light.text,
    borderBottomRightRadius: BorderRadius.xs,
  },
  assistantBubble: {
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: BorderRadius.xs,
  },
  messageText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * 1.5,
  },
  userText: {
    color: Colors.light.background,
  },
  assistantText: {
    color: Colors.light.text,
  },
  chatInputContainer: {
    paddingHorizontal: 0, // Removed - handled by parent
    paddingVertical: 0, // Removed - handled by parent
    backgroundColor: 'transparent',
    position: 'relative',
  },
  chatInputWrapper: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: 'rgba(31,86,97,0.15)',
    borderRadius: BorderRadius.lg, // 16px
    height: 192, // Fixed height from Figma (not minHeight)
    paddingHorizontal: 12, // 12px from Figma
    paddingVertical: Spacing.md, // 16px from Figma
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
    marginBottom: 0, // No margin - using flex gap instead
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17, // Matching Figma design gap
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
    opacity: 0.6, // Matching Figma opacity
  },
  voiceButton: {
    padding: Spacing.xs,
    opacity: 0.5, // Matching Figma opacity
  },
  sendButton: {
    backgroundColor: Colors.light.text, // Dark teal #1f5661
    borderRadius: 24, // 24px matching Figma
    padding: Spacing.sm, // 8px matching Figma
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  clearButton: {
    position: 'absolute',
    top: Spacing.md + 8,
    right: Spacing.lg + 8,
    padding: Spacing.xs,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.sm,
  },
});
