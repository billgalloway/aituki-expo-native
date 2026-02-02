/**
 * Loading screen – matches Figma aiTuki prototype exactly
 * https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=668-21530
 * https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01?node-id=788-22077
 *
 * Design: Full-bleed background; gradient lighter/white-teal top-left → darker saturated teal bottom-right;
 * optional video; 50% opacity gradient overlay; centered logo (120×120).
 * All colors and dimensions from theme.LoadingScreenTheme.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { LoadingScreenTheme } from '@/constants/theme';

// Conditionally import Video - may not be available in Expo Go
let Video: any = null;
let ResizeMode: any = null;
let AVPlaybackStatus: any = null;

// Check if we're in Expo Go (where expo-av doesn't work)
const isExpoGo = Constants.executionEnvironment === 'storeClient';

if (!isExpoGo) {
  try {
    const avModule = require('expo-av');
    Video = avModule.Video;
    ResizeMode = avModule.ResizeMode;
    AVPlaybackStatus = avModule.AVPlaybackStatus;
  } catch (error) {
    // expo-av not available
    console.warn('expo-av not available, video will be disabled');
  }
}

const LOGO_URL = 'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/brand/loadingLogo.png';

export default function LoadingScreen() {
  const videoRef = useRef<any>(null);
  const [videoError, setVideoError] = useState(!Video); // Start with error if Video not available
  const [videoAvailable, setVideoAvailable] = useState(!!Video);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Play video on mount if available
    if (Video && videoRef.current && !videoError && videoAvailable) {
      videoRef.current.playAsync().catch(() => {
        setVideoError(true);
      });
    }
  }, [videoError, videoAvailable]);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status?.isLoaded && status.didJustFinish) {
      // Loop the video
      videoRef.current?.replayAsync();
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Video - only render if Video component is available */}
      {Video && !videoError && (
        <Video
          ref={videoRef}
          source={{ uri: 'https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/video/kuzfilm._young_woman_18_years_old_glamour_portrait_--ar_5191__3980b803-00b2-48a7-b63e-a058597906e4_0.mp4' }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode?.COVER}
          isLooping
          isMuted
          shouldPlay
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={() => setVideoError(true)}
        />
      )}
      
      {/* Gradient Overlay – Figma: top-left lighter → bottom-right darker, 50% opacity */}
      <LinearGradient
        colors={[LoadingScreenTheme.gradient.topLeft, LoadingScreenTheme.gradient.mid, LoadingScreenTheme.gradient.bottomRight]}
        locations={LoadingScreenTheme.gradientLocations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: LoadingScreenTheme.gradientOverlayOpacity }]}
      />
      
      {/* Logo – Figma: centered, 120×120 */}
      <View style={styles.logoWrapper}>
        <Image
          source={{ uri: LOGO_URL }}
          style={styles.logo}
          contentFit="contain"
          transition={200}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LoadingScreenTheme.gradient.mid,
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LoadingScreenTheme.logoSize,
    height: LoadingScreenTheme.logoSize,
  },
});
