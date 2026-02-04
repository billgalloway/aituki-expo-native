/**
 * ThemedSwitch – RCTSwitch styled from Tuki Figma (node-id=11022-144509)
 * Uses theme.switch variables: trackColorOff, trackColorOn, thumbColor, iosBackgroundColor
 */

import React from 'react';
import { Switch, SwitchProps, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

// Use light theme; switch to dark when useColorScheme supports it
const switchColors = Colors.light.switch;

export function ThemedSwitch(props: SwitchProps) {
  return (
    <Switch
      {...props}
      trackColor={{
        false: switchColors.trackColorOff,
        true: switchColors.trackColorOn,
      }}
      thumbColor={switchColors.thumbColor}
      {...(Platform.OS === 'ios' && {
        ios_backgroundColor: switchColors.iosBackgroundColor,
      })}
    />
  );
}

export default ThemedSwitch;
