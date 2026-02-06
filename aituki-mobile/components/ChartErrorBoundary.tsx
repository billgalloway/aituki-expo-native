/**
 * Error Boundary for Chart Components
 * Catches render errors in chart section (e.g. react-native-gifted-charts Android crash)
 * and shows a fallback UI instead of crashing.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChartErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Unable to load charts</Text>
          <Text style={styles.message}>
            Charts could not be displayed. This may be a platform limitation.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  message: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
