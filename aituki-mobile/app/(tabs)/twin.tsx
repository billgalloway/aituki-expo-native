/**
 * Twin Screen (Digital Twin Chat)
 * Chat interface with AI digital twin
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
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

export default function TwinScreen() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
              <Text style={styles.greeting}>Hello, Pilar</Text>
              <View style={styles.badges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Pro member</Text>
                </View>
                <Text style={styles.scoreText}>Tuki Score 78%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chat Input Card */}
        <View style={styles.chatInputCard}>
          <Text style={styles.placeholderText}>Ask me anything</Text>
          <View style={styles.chatActions}>
            <View style={styles.chatActionsLeft}>
              <TouchableOpacity>
                <IconLibrary iconName="add" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity>
                <IconLibrary iconName="language" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity>
                <IconLibrary iconName="drag-indicator" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.chatActionsRight}>
              <TouchableOpacity>
                <IconLibrary iconName="mic" size={24} color={Colors.light.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton}>
                <IconLibrary iconName="send" size={24} color={Colors.light.background} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Alert */}
        {showAlert && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>Hydration reminders</Text>
            <TouchableOpacity onPress={() => setShowAlert(false)}>
              <IconLibrary iconName="close" size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Goal Suggestions */}
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
    paddingBottom: 120,
    gap: Spacing.md,
  },
  profileHeader: {
    backgroundColor: Colors.light.background,
    borderBottomLeftRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
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
    borderColor: Colors.light.accent,
    backgroundColor: 'rgba(105, 240, 240, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
    gap: Spacing.xs,
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
    fontSize: 13,
    color: Colors.light.background,
  },
  scoreText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
  },
  chatInputCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(31, 86, 97, 0.15)',
    backgroundColor: '#fafafa',
    height: 192,
    justifyContent: 'space-between',
  },
  placeholderText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.light.textSecondary,
    opacity: 0.6,
  },
  chatActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatActionsLeft: {
    flexDirection: 'row',
    gap: 17,
    alignItems: 'center',
  },
  chatActionsRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: '#e5f6fd',
    gap: Spacing.sm,
  },
  alertText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: '#014361',
  },
  suggestionsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.lg,
  },
  suggestionCard: {
    minWidth: 191,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
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
});
