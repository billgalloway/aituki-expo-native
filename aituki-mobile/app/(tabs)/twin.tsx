/**
 * Twin Screen (Digital Twin Chat)
 * Chat interface with AI digital twin
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import ChatInterface from '@/components/ChatInterface';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

const goalSuggestions = [
  {
    title: 'Health goal',
    subtitle: 'Based on my existing data',
    backgroundColor: 'rgba(105, 240, 240, 0.08)',
  },
  {
    title: 'Perimenopause goal',
    subtitle: 'based on my personal input',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  {
    title: 'Create a fitness goal',
    subtitle: 'Based on my body type',
    backgroundColor: 'rgba(2, 136, 209, 0.08)',
  },
  {
    title: 'Create a wellbeing goal',
    subtitle: 'Based on my data',
    backgroundColor: 'rgba(46, 125, 50, 0.08)',
  },
  {
    title: 'Create a spiritual goal',
    subtitle: 'based on my wishes',
    backgroundColor: 'rgba(229, 255, 0, 0.2)',
  },
];

import { ChatMessage } from '@/services/openai';

export default function TwinScreen() {
  const [showAlert, setShowAlert] = useState(true);
  const [hasMessages, setHasMessages] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const insets = useSafeAreaInsets();
  
  // System prompt for the AI twin - customize this to match your app's personality
  const aiSystemPrompt = `You are a helpful AI wellness assistant for the AiTuki app. You help users with their health and wellness goals, providing personalized guidance based on their data and preferences. Be friendly, supportive, concise, and encouraging. Focus on health, fitness, perimenopause support, wellbeing, and spiritual growth.`;

  const handleMessagesChange = (messageCount: number) => {
    setHasMessages(messageCount > 0);
  };

  const handleMessagesUpdate = (messages: ChatMessage[]) => {
    setChatMessages(messages);
  };
  
  // Bottom navigation bar height (to position chat interface above it)
  // From BottomNavigation: paddingTop (Spacing.md) + icon height (24) + paddingBottom (Spacing.sm) + safe area
  const bottomNavHeight = Spacing.md + 24 + Spacing.sm + insets.bottom;

  return (
    <View style={styles.container}>
      <Header />
      {hasMessages ? (
        // When messages exist: Chat interface takes full screen with input fixed at bottom
        <ChatInterface
          key="twin-chat" // Same key to preserve state across remounts
          systemPrompt={aiSystemPrompt}
          placeholder="Ask me anything"
          onMessagesChange={handleMessagesChange}
          onMessagesUpdate={handleMessagesUpdate}
          bottomOffset={bottomNavHeight}
          initialMessages={chatMessages}
          inputHeight={120}
          bottomPadding={32}
        />
      ) : (
        // Initial state: Scrollable content with chat input in flow
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.dateRow}>
              <IconLibrary iconName="calendar-today" size={24} color={Colors.light.text} />
              <Text style={styles.dateText}>July 25th 2025</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <IconLibrary iconName="person" size={32} color={Colors.light.text} />
              </View>
              <View style={styles.profileText}>
                <Text style={styles.greeting}>Hello world</Text>
                <View style={styles.badges}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Pro member</Text>
                  </View>
                  <Text style={styles.scoreText}>Tuki Score 78%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chat Interface Container */}
          <View style={styles.chatSection}>
            <View style={styles.chatSectionInner}>
              <ChatInterface
                key="twin-chat" // Same key to preserve state across remounts
                systemPrompt={aiSystemPrompt}
                placeholder="Ask me anything"
                onMessagesChange={handleMessagesChange}
                onMessagesUpdate={handleMessagesUpdate}
                bottomOffset={0}
                initialMessages={chatMessages}
                inputHeight={192}
                bottomPadding={24}
              />
              {/* Alert */}
              {showAlert && (
                <View style={styles.alert}>
                  <View style={styles.alertIconContainer}>
                    <IconLibrary iconName="info" size={22} color="#0288d1" />
                  </View>
                  <Text style={styles.alertText}>Hydration reminders</Text>
                  <TouchableOpacity 
                    style={styles.alertCloseButton}
                    onPress={() => setShowAlert(false)}>
                    <View style={styles.alertCloseIcon}>
                      <IconLibrary iconName="close" size={20} color="#014361" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Goal Suggestions - Quick Action Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContainer}>
          {goalSuggestions.map((goal, index) => (
            <View
              key={index}
              style={[styles.suggestionCard, { backgroundColor: goal.backgroundColor }]}>
              <Text style={styles.suggestionTitle}>{goal.title}</Text>
              <Text style={styles.suggestionSubtitle}>{goal.subtitle}</Text>
            </View>
          ))}
          </ScrollView>
        </ScrollView>
      )}

      <BottomNavigation activeTab="tuki" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  profileHeader: {
    backgroundColor: Colors.light.background,
    borderBottomLeftRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
    paddingTop: 0,
    paddingBottom: Spacing.md, // 16px
    paddingLeft: Spacing.lg, // 24px
    paddingRight: Spacing.sm, // 8px
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm, // 8px
    marginTop: Spacing.md, // 16px above dateRow
    marginBottom: Spacing.sm, // 8px gap after date row
  },
  dateText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.light.text,
  },
  profileInfo: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 53,
    height: 53,
    borderRadius: 26.5,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(105, 240, 240, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
    gap: Spacing.xs, // 4px gap between greeting and badges
  },
  greeting: {
    fontFamily: Typography.fontFamily,
    fontSize: 34,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.text,
  },
  badgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: Colors.light.background,
  },
  scoreText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, // 16px
    paddingVertical: 6, // 6px
    borderRadius: BorderRadius.sm, // 8px
    backgroundColor: '#e5f6fd',
    gap: Spacing.sm,
  },
  suggestionsContainer: {
    paddingHorizontal: Spacing.lg, // 24px
    paddingVertical: Spacing.md, // 16px
    gap: Spacing.lg, // 24px gap between cards
    alignItems: 'flex-start', // Hug content height
  },
  suggestionCard: {
    padding: Spacing.md - 4, // 12px (var(--3) from Figma)
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs, // 4px gap between title and subtitle
    alignSelf: 'flex-start', // Hug content
  },
  suggestionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.text,
  },
  suggestionSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xs,
    color: Colors.light.textSecondary,
    opacity: 0.6,
  },
  chatSection: {
    paddingHorizontal: Spacing.lg, // 24px (px-[24px] from Figma)
    paddingTop: Spacing.md, // 16px (pt-[16px] from Figma)
    paddingBottom: 0, // 0px (pb-[var(--0,0px)] from Figma)
  },
  chatSectionInner: {
    flexDirection: 'column', // Explicitly set column layout
    gap: Spacing.xl, // 32px gap between chat and alert
  },
  alertIconContainer: {
    paddingRight: Spacing.md - 4, // 12px
    paddingVertical: 7, // 7px
    alignItems: 'flex-start',
  },
  alertText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: '#014361',
    paddingVertical: Spacing.sm, // 8px
  },
  alertCloseButton: {
    paddingLeft: Spacing.md, // 16px
    paddingRight: 0,
    paddingTop: 4, // 4px
    paddingBottom: 0,
  },
  alertCloseIcon: {
    padding: 5, // 5px
    borderRadius: BorderRadius.round,
  },
});
