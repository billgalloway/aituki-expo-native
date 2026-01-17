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
  Modal,
  Animated,
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
  onLoadingChange?: (isLoading: boolean) => void; // Callback to sync loading state to parent
  bottomOffset?: number; // Offset from bottom (e.g., for navigation bar)
  initialMessages?: ChatMessage[]; // Allow parent to provide initial messages
  inputHeight?: number; // Custom height for the input box (default: 192)
  bottomPadding?: number; // Additional bottom padding to move icons up (default: 0)
  initialLoading?: boolean; // Allow parent to provide initial loading state
}

export default function ChatInterface({
  systemPrompt = "You are a helpful AI assistant that provides personalized health and wellness guidance. Be friendly, supportive, and concise. You are Tuki a digital twin here to help users understand their body and can give helpful tips on how to stay healthy and well. Physically, mentally, spiritually and emotionally.",

  placeholder = "Ask me anything",
  onError,
  onMessagesChange,
  onMessagesUpdate,
  onLoadingChange,
  bottomOffset = 0,
  initialMessages = [],
  inputHeight = 192,
  bottomPadding = 0,
  initialLoading = false,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(initialLoading);
  const loadingStartTimeRef = useRef<number | null>(null);
  const MIN_LOADING_TIME = 500; // Minimum 500ms to show loader
  const dotAnimations = useRef([
    new Animated.Value(0.4),
    new Animated.Value(0.4),
    new Animated.Value(0.4),
  ]).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const textPulseOpacity = useRef(new Animated.Value(0.6)).current;
  
  // Sync initialLoading prop changes (important for remounts)
  useEffect(() => {
    if (initialLoading !== isLoading) {
      setIsLoading(initialLoading);
    }
  }, [initialLoading]);
  
  // Animate loading message bubble fade in/out and typing dots
  useEffect(() => {
    if (isLoading) {
      loadingStartTimeRef.current = Date.now();
      // Fade in animation
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Start pulsing animation for text
      Animated.loop(
        Animated.sequence([
          Animated.timing(textPulseOpacity, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(textPulseOpacity, {
            toValue: 0.6,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Animate dots
      const animations = dotAnimations.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 200),
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(anim, {
                toValue: 0.4,
                duration: 400,
                useNativeDriver: true,
              }),
            ])
          ),
        ]);
      });
      Animated.parallel(animations).start();
    } else {
      loadingStartTimeRef.current = null;
      // Fade out animation
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      // Stop pulsing and reset
      textPulseOpacity.stopAnimation();
      textPulseOpacity.setValue(0.6);
      // Reset animations
      dotAnimations.forEach(anim => anim.setValue(0.4));
    }
  }, [isLoading, loadingOpacity, textPulseOpacity]);
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

  // Scroll to bottom when loading starts
  useEffect(() => {
    if (isLoading) {
      console.log('isLoading changed to true, scrolling to bottom');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [isLoading]);

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
    const trimmedText = inputText.trim();
    if (!trimmedText || isLoading) {
      return;
    }

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
    
    // Set loading state FIRST and notify parent BEFORE messages update (critical for remount)
    // CRITICAL: Set parent loading state FIRST, before messages update triggers remount
    onLoadingChange?.(true);
    setIsLoading(true);
    
    // Small delay to ensure parent state is set before remount
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Now notify parent about messages (this will trigger remount if hasMessages changes)
    onMessagesUpdate?.(newMessages);
    onMessagesChange?.(newMessages.length);
    
    // Force a re-render and scroll to show loading message
    requestAnimationFrame(() => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
        console.log('handleSend: Scrolled to end after setting loading');
      }, 200);
    });

    try {
      console.log('handleSend: Calling OpenAI API');
      const startTime = Date.now();
      const assistantResponse = await sendChatMessage(newMessages, systemPrompt);
      const elapsedTime = Date.now() - startTime;
      
      if (!assistantResponse) {
        throw new Error('No response from AI');
      }
      
      // Ensure minimum loading time for visibility
      const remainingTime = MIN_LOADING_TIME - elapsedTime;
      if (remainingTime > 0) {
        console.log(`handleSend: Waiting ${remainingTime}ms to ensure loader is visible`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse,
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      console.log('handleSend: Success', { messageCount: finalMessages.length, messages: finalMessages.map(m => ({ role: m.role, contentLength: m.content.length })) });
      
      // Notify parent component of message updates (already notified above, but update with final messages)
      onMessagesUpdate?.(finalMessages);
      onMessagesChange?.(finalMessages.length);
    } catch (error) {
      console.error('handleSend: Error', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      console.log('handleSend: Showing error alert', errorMessage);
      
      // Ensure minimum loading time even on error
      const elapsedTime = loadingStartTimeRef.current ? Date.now() - loadingStartTimeRef.current : 0;
      const remainingTime = MIN_LOADING_TIME - elapsedTime;
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
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
      onLoadingChange?.(false); // Notify parent that loading is complete
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
      {/* Messages Container - Only show when there are messages or loading */}
      {(messages.length > 0 || isLoading || initialLoading) ? (
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
          {/* Loading indicator as a message bubble - appears after user message */}
          {(isLoading || initialLoading) && (
            <Animated.View 
              style={[
                styles.messageContainer, 
                styles.assistantMessage,
                { opacity: loadingOpacity }
              ]} 
              key="loading-indicator">
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <Animated.Text style={[styles.typingText, { opacity: textPulseOpacity }]}>
                  thinking about it...
                </Animated.Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      ) : (
        // Empty view when no messages - takes no space
        <View style={styles.emptyMessagesContainer} />
      )}

      {/* Input Container - Matching Figma Design */}
      <View style={[
        styles.chatInputContainer, 
        { 
          // Position absolutely only when bottomOffset is provided (has messages)
          // Otherwise, it's in normal flow (initial state)
          position: bottomOffset > 0 ? 'absolute' : 'relative',
          bottom: bottomOffset > 0 ? 0 : undefined,
          left: bottomOffset > 0 ? 0 : undefined,
          right: bottomOffset > 0 ? 0 : undefined,
          // Extend to bottom, nav overlays on top - only account for keyboard on Android
          paddingBottom: Platform.OS === 'android' 
            ? keyboardHeight // Only account for keyboard, nav overlays on top
            : 0 // No padding needed, extends to bottom
        }
      ]}>
        {/* Make entire chat input wrapper a hotspot to activate keyboard - extends to bottom */}
        <Pressable 
          style={styles.chatInputWrapper}
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
                  if (inputText.trim() && !isLoading) {
                    handleSend();
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
    marginTop: 0, // No top margin when in normal flow
    paddingTop: 0, // No top padding when in normal flow
  },
  messagesContainer: {
    flex: 1, // Take available space when messages exist
    minHeight: 1, // Ensure it takes space even when empty
  },
  emptyMessagesContainer: {
    height: 0, // Take no space when empty
    flex: 0, // Don't expand
  },
  messagesContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
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
    borderBottomRightRadius: BorderRadius.sm,
  },
  assistantBubble: {
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: BorderRadius.sm,
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
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 20, // Ensure minimum height for visibility
    paddingVertical: 2, // Add some vertical padding
  },
  thinkingSpinner: {
    // No margin needed, gap handles spacing
  },
  thinkingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.text, // Use primary text color instead of secondary for better visibility
    fontStyle: 'italic',
    flex: 1, // Take available space
    lineHeight: Typography.fontSize.base * 1.4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.text,
    fontStyle: 'italic',
  },
  chatInputContainer: {
    paddingHorizontal: 0, // Full width - no horizontal padding
    paddingTop: Spacing.lg, // 24px padding above text input
    paddingBottom: 0,
    backgroundColor: 'transparent',
    // Position will be set dynamically based on bottomOffset
    position: 'relative', // Default to relative for normal flow
    width: '100%', // Ensure full width
  },
  chatInputWrapper: {
    backgroundColor: Colors.light.background, // White background from Figma
    borderRadius: BorderRadius.lg, // 16px
    paddingHorizontal: 12, // 12px from Figma
    paddingTop: 8, // 8px top padding from Figma (pt-[8px])
    paddingBottom: 0, // No bottom padding - extends to bottom of container
    justifyContent: 'space-between', // Align content to top and bottom
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // For Android shadow
    // Extend to bottom of container
    flex: 1, // Take all available vertical space
    minHeight: 192, // Minimum height for initial state
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
    marginTop: Spacing.lg, // 24px gap between text and icons from Figma (gap-[var(--5,24px)])
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
    padding: Spacing.sm,
    opacity: 0.6, // Matching Figma opacity
  },
  voiceButton: {
    padding: Spacing.sm,
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
    padding: Spacing.sm,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.sm,
  },
  loadingTextContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: 30,
    backgroundColor: Colors.light.background,
    marginBottom: Spacing.sm,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.textSecondary,
  },
  typingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.text,
    fontStyle: 'italic',
  },
  simpleLoadingIndicator: {
    position: 'absolute',
    top: 100,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 9999,
    elevation: 9999,
    backgroundColor: Colors.light.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  simpleLoadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.text,
    fontStyle: 'italic',
    textAlign: 'left',
  },
});
