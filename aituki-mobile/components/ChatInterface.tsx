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
  Pressable,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';
import { sendChatMessage, ChatMessage, isOpenAIConfigured } from '@/services/openai';

interface ChatInterfaceProps {
  systemPrompt?: string;
  placeholder?: string;
  onError?: (error: string) => void;
  onMessagesChange?: (messageCount: number) => void;
  onMessagesUpdate?: (messages: ChatMessage[]) => void; // Callback to sync messages to parent
  bottomOffset?: number; // Offset from bottom (e.g., for navigation bar)
  initialMessages?: ChatMessage[]; // Allow parent to provide initial messages
  inputHeight?: number; // Custom height for the input box (default: 192)
  bottomPadding?: number; // Additional bottom padding to move icons up (default: 0)
}

export default function ChatInterface({
  systemPrompt = "You are a helpful AI assistant that provides personalized health and wellness guidance. Be friendly, supportive, and concise.",
  placeholder = "Ask me anything",
  onError,
  onMessagesChange,
  onMessagesUpdate,
  bottomOffset = 0,
  initialMessages = [],
  inputHeight = 192,
  bottomPadding = 0,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  
  // Sync initialMessages prop changes to state
  useEffect(() => {
    if (initialMessages.length > 0 && initialMessages.length !== messages.length) {
      console.log('Syncing initialMessages to state', { 
        initialCount: initialMessages.length, 
        currentCount: messages.length 
      });
      setMessages(initialMessages);
    }
  }, [initialMessages.length]); // Only trigger on length change to avoid loops

  // Sync with initialMessages if provided (for when component remounts with same key)
  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      console.log('Restoring initial messages', { count: initialMessages.length });
      setMessages(initialMessages);
    }
  }, []); // Only run once on mount

  // Notify parent when messages change
  useEffect(() => {
    console.log('Messages changed', { messageCount: messages.length, messages: messages.map(m => ({ role: m.role, contentLength: m.content.length })) });
    onMessagesChange?.(messages.length);
    onMessagesUpdate?.(messages); // Also sync full messages array to parent
  }, [messages, onMessagesChange, onMessagesUpdate]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle keyboard show/hide events
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to bottom when keyboard appears
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, Platform.OS === 'ios' ? 250 : 100);
      }
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSend = async () => {
    console.log('handleSend called', { inputText, inputTextLength: inputText.length, isLoading });
    const trimmedText = inputText.trim();
    if (!trimmedText || isLoading) {
      console.log('handleSend: Early return - no text or loading', { trimmedText, isLoading });
      return;
    }

    console.log('handleSend: Proceeding with send');

    if (!isOpenAIConfigured()) {
      const errorMsg = 'OpenAI API key is not configured. Please add your API key to app.json.';
      Alert.alert('Configuration Error', errorMsg);
      onError?.(errorMsg);
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedText,
    };

    // Add user message to chat immediately (optimistic update)
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const savedInputText = trimmedText; // Save text before clearing
    setInputText('');
    setIsLoading(true);

    try {
      console.log('handleSend: Calling OpenAI API');
      const assistantResponse = await sendChatMessage(newMessages, systemPrompt);
      
      if (!assistantResponse) {
        throw new Error('No response from AI');
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse,
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      console.log('handleSend: Success', { messageCount: finalMessages.length, messages: finalMessages.map(m => ({ role: m.role, contentLength: m.content.length })) });
      
      // Notify parent component of message updates
      onMessagesUpdate?.(finalMessages);
      onMessagesChange?.(finalMessages.length);
    } catch (error) {
      console.error('handleSend: Error', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      console.log('handleSend: Showing error alert', errorMessage);
      
      // Show error message to user
      Alert.alert('Error', errorMessage, [
        { 
          text: 'OK', 
          onPress: () => {
            // Remove the user message if there was an error - restore to previous state
            setMessages(messages);
            // Restore the input text so user can try again
            setInputText(savedInputText);
          }
        }
      ]);
      
      onError?.(errorMessage);
      // Remove the user message if there was an error - restore to previous state
      setMessages(messages);
      // Restore the input text so user can try again
      setInputText(savedInputText);
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

  // Handle image picker functionality (platform's image picker)
  const handleUpload = async () => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need access to your photos to select an image.');
        return;
      }

      // Open the platform's native image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        // For now, just show an alert with image info
        // In production, you would upload the image to your server or attach it to the message
        Alert.alert(
          'Image Selected',
          `Selected: ${image.fileName || 'Image'}\nWidth: ${image.width}px\nHeight: ${image.height}px`,
          [{ text: 'OK' }]
        );
        // TODO: Upload image to server, attach to message, display in chat, etc.
        // The image URI is available at: image.uri
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Handle voice-to-text functionality (platform's voice input)
  const handleVoiceInput = () => {
    // For now, show an alert. In production, use expo-speech or react-native-voice
    // This will open the platform's native voice-to-text
    Alert.alert(
      'Voice Input',
      'Voice-to-text functionality will open the platform\'s voice input. Install expo-speech or react-native-voice to enable this feature.',
      [{ text: 'OK' }]
    );
    // TODO: Implement with expo-speech or react-native-voice
    // This typically requires platform-specific setup
  };

  // Handle language selection (placeholder for now)
  const handleLanguage = () => {
    Alert.alert('Language', 'Language selection feature coming soon.', [{ text: 'OK' }]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? bottomOffset : 0}
      enabled={Platform.OS === 'ios'}>
      {/* Messages Container */}
      {(messages.length > 0 || isLoading) && (
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            Platform.OS === 'android' && keyboardHeight > 0 && { paddingBottom: keyboardHeight }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
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
      )}

      {/* Input Container - Matching Figma Design */}
      <View style={[
        styles.chatInputContainer, 
        { 
          paddingBottom: Platform.OS === 'android' 
            ? bottomOffset + bottomPadding + keyboardHeight 
            : bottomOffset + bottomPadding 
        }
      ]}>
        {/* Make entire chat input wrapper a hotspot to activate keyboard */}
        <Pressable 
          style={[styles.chatInputWrapper, { height: inputHeight }]}
          onPress={() => {
            // Focus the TextInput when anywhere in the wrapper is pressed (except icon buttons)
            textInputRef.current?.focus();
          }}>
          {/* Text Input Area - container takes full space so Pressable receives touches in empty areas */}
          <View style={styles.textInputContainer} pointerEvents="box-none">
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={inputText}
              onChangeText={(text) => {
                console.log('onChangeText called', { text, length: text.length });
                setInputText(text);
              }}
              placeholder={placeholder}
              placeholderTextColor="#1F5661"
              multiline
              maxLength={500}
              editable={!isLoading}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              textAlignVertical="top"
              keyboardType="default"
              autoCorrect={true}
              autoCapitalize="sentences"
              blurOnSubmit={false}
              showSoftInputOnFocus={true}
            />
          </View>
          
          {/* Bottom row with icons - iconBar has its own hit areas */}
          <View style={styles.inputRow} pointerEvents="box-none">
            {/* Left icons: plus, language, attachment - NOT part of keyboard hotspot */}
            <View style={styles.leftIcons} pointerEvents="box-none">
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent triggering the Pressable
                  handleUpload();
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconLibrary iconName="add" size={24} color="#1F5661" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleLanguage();
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconLibrary iconName="language" size={24} color="#1F5661" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconLibrary iconName="photo" size={24} color="#1F5661" />
              </TouchableOpacity>
            </View>
            
            {/* Right side: voice icon and send button */}
            <View style={styles.rightIcons} pointerEvents="box-none">
              <TouchableOpacity 
                style={styles.voiceButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleVoiceInput();
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <IconLibrary iconName="mic" size={24} color="#1F5661" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
                onPress={(e) => {
                  e.stopPropagation();
                  const currentText = textInputRef.current?.props?.value || textInputRef.current?.value || inputText || '';
                  if (currentText.trim() && !isLoading) {
                    if (!inputText.trim() && currentText.trim()) {
                      setInputText(currentText);
                      setTimeout(() => handleSend(), 100);
                    } else {
                      handleSend();
                    }
                  }
                }}
                disabled={!inputText.trim() || isLoading}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <IconLibrary iconName="send" size={24} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
        
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
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  messagesContainer: {
    flex: 1, // Take available space
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
    paddingHorizontal: 0, // Full width - no horizontal padding
    paddingBottom: 0,
    backgroundColor: 'transparent',
    position: 'relative',
    width: '100%', // Ensure full width
  },
  chatInputWrapper: {
    backgroundColor: Colors.light.background, // White background from Figma
    borderRadius: BorderRadius.lg, // 16px
    paddingHorizontal: 12, // 12px from Figma
    paddingTop: 8, // 8px top padding from Figma (pt-[8px])
    paddingBottom: Spacing.md, // 16px bottom padding (reduced from 32px to match Figma visual)
    height: undefined, // Will be set dynamically via inline style
    justifyContent: 'space-between', // Align content to top and bottom
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // For Android shadow
  },
  textInputContainer: {
    flex: 1, // Take up available space above icons
    width: '100%',
    justifyContent: 'flex-start',
  },
  textInput: {
    width: '100%',
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm, // 14px from Figma
    color: '#1F5661', // Secondary main color
    marginBottom: 0,
    padding: 0,
    minHeight: 20, // Allow single line
    maxHeight: 60, // Limit height to keep compact
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto', // Push icons to bottom
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
