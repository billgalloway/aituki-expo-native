/**
 * Stress Dashboard Component
 * Matches Figma design exactly with white circle background, centered pie chart, and centered text
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import IconLibrary from '@/components/IconLibrary';

interface StressDashboardProps {
  stressLevel?: number; // 0-100
  stressLabel?: string;
}

export default function StressDashboard({ 
  stressLevel = 60, 
  stressLabel = 'Stress rising' 
}: StressDashboardProps) {
  const progressRingSize = 146; // Progress ring size (unchanged)
  const whiteCircleSize = 162; // White background circle: 146 + 16px
  const strokeWidth = 8;
  const radius = (progressRingSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = stressLevel / 100;
  const strokeDashoffset = circumference * (1 - progress);
  const whiteCircleRadius = whiteCircleSize / 2;

  // Curved "Subtract" shape - creates an arc/curve shape
  // Width: 148px, Height: 101px
  const curvedPath = "M 0 0 Q 74 -15 148 0 L 148 101 L 0 101 Z";

  // Calculate position for 347x315 container
  // Figma: left-[calc(50%+0.5px)] top-[calc(50%-33.5px)] with translate-x-[-50%] translate-y-[-50%]
  // This means: center horizontally, but offset vertically by -33.5px from center
  const containerWidth = 347;
  const containerHeight = 315;
  const circleLeft = (containerWidth - whiteCircleSize) / 2; // Centered horizontally: (347 - 162) / 2 = 92.5px
  // Vertical: 50% of container height - 33.5px, then translate back by 50% of circle height
  // Top edge = (315 / 2) - 33.5 - (162 / 2) = 157.5 - 33.5 - 81 = 43px
  const circleTop = (containerHeight / 2) - 33.5 - (whiteCircleSize / 2);

  return (
    <View style={styles.container}>
      {/* Four Pillars with Curved Shapes - Rendered FIRST (behind circle) */}
      <View style={styles.pillarsContainer}>
        {/* Energy - Top Left: left-[22px] top-[20px] - Light lavender/purple */}
        <View style={styles.pillarEnergyShadow}>
          <View style={[styles.pillarEnergy, { backgroundColor: '#E8D5FF' }]}>
            <Svg width={148} height={101} style={styles.pillarShape} viewBox="0 0 148 101">
              <Path
                d="M 0 101 Q 74 116 148 101 L 148 0 L 0 0 Z"
                fill="#E8D5FF"
              />
            </Svg>
            <View style={styles.pillarContentEnergy}>
              <IconLibrary iconName="woman" size={24} color={Colors.light.text} />
              <Text style={styles.pillarText}>Energy</Text>
            </View>
          </View>
        </View>

        {/* Mental - Top Right: left-[177px] top-[20px] - Teal */}
        <View style={styles.pillarMentalShadow}>
          <View style={[styles.pillarMental, { backgroundColor: Colors.light.primary }]}>
            <Svg width={148} height={101} style={styles.pillarShape} viewBox="0 0 148 101">
              <Path
                d="M 148 0 Q 74 15 0 0 L 0 101 L 148 101 Z"
                fill={Colors.light.primary}
              />
            </Svg>
            <View style={styles.pillarContentMental}>
              <Text style={styles.pillarText}>Mental</Text>
              <IconLibrary iconName="brain" size={24} color={Colors.light.text} />
            </View>
          </View>
        </View>

        {/* Physical - Bottom Left: left-[22px] top-[128px] - Light green */}
        <View style={styles.pillarPhysicalShadow}>
          <View style={[styles.pillarPhysical, { backgroundColor: '#C8E6C9' }]}>
            <Svg width={148} height={101} style={styles.pillarShape} viewBox="0 0 148 101">
              <Path
                d="M 0 101 Q 74 116 148 101 L 148 0 L 0 0 Z"
                fill="#C8E6C9"
              />
            </Svg>
            <View style={styles.pillarContentPhysical}>
              <IconLibrary iconName="sport" size={24} color={Colors.light.text} />
              <Text style={styles.pillarText}>Physical</Text>
            </View>
          </View>
        </View>

        {/* Emotional - Bottom Right: left-[177px] top-[128px] - Light yellow */}
        <View style={styles.pillarEmotionalShadow}>
          <View style={[styles.pillarEmotional, { backgroundColor: '#FFF9C4' }]}>
            <Svg width={148} height={101} style={styles.pillarShape} viewBox="0 0 148 101">
              <Path
                d="M 148 0 Q 74 -15 0 0 L 0 101 L 148 101 Z"
                fill="#FFF9C4"
              />
            </Svg>
            <View style={styles.pillarContentEmotional}>
              <Text style={styles.pillarText}>Emotional</Text>
              <IconLibrary iconName="pagoda" size={24} color={Colors.light.text} />
            </View>
          </View>
        </View>
      </View>

      {/* Central Circular Progress Indicator - Centered with white background */}
      <View style={[styles.progressWrapper, { left: circleLeft, top: circleTop, width: whiteCircleSize, height: whiteCircleSize }]}>
        <Svg width={whiteCircleSize} height={whiteCircleSize} style={styles.progressSvg}>
          {/* White background circle - larger to create border around progress ring */}
          <Circle
            cx={whiteCircleSize / 2}
            cy={whiteCircleSize / 2}
            r={whiteCircleRadius}
            fill={Colors.light.background}
          />
          {/* Background circle ring - centered within white circle, matching orange ring position */}
          <Circle
            cx={whiteCircleSize / 2}
            cy={whiteCircleSize / 2}
            r={radius}
            stroke={Colors.light.border}
            strokeWidth={strokeWidth}
            fill="none"
            transform={`rotate(-90 ${whiteCircleSize / 2} ${whiteCircleSize / 2})`}
          />
          {/* Progress circle - orange arc - centered within white circle */}
          <Circle
            cx={whiteCircleSize / 2}
            cy={whiteCircleSize / 2}
            r={radius}
            stroke={Colors.light.warning}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${whiteCircleSize / 2} ${whiteCircleSize / 2})`}
          />
        </Svg>
        {/* Center text - perfectly centered */}
        <View style={[styles.centerTextContainer, { width: whiteCircleSize, height: whiteCircleSize }]}>
          <View style={styles.textGroup}>
            <Text style={styles.percentage}>{stressLevel}%</Text>
            <Text style={styles.label}>{stressLabel}</Text>
          </View>
        </View>
      </View>

      {/* View pillar breakdown button - left-[20px] top-[259px] */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View pillar breakdown</Text>
        <IconLibrary iconName="arrow-forward" size={16} color={Colors.light.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    height: 315,
    width: 347,
    position: 'relative',
  },
  pillarsContainer: {
    width: 347,
    height: 229, // 20 + 101 + 8 (top padding + pillar height + spacing)
    position: 'relative',
    zIndex: 1, // Behind the circle
  },
  // Energy - Top Left: left-[22px] top-[20px] with px-[8px] py-[7px]
  pillarEnergyShadow: {
    position: 'absolute',
    left: 22,
    top: 20,
    width: 148,
    height: 101,
    // Drop shadow: Black100 + Black200, radius: Depth100/2 (2), offset: (0, Depth025/1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Depth025 = 1
    shadowOpacity: 0.15, // Combined opacity for both shadows
    shadowRadius: 2, // Depth100/2 = 2
    elevation: 2, // Android shadow
  },
  pillarEnergy: {
    width: 148,
    height: 101,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pillarContentEnergy: {
    position: 'absolute',
    left: 8,
    top: 7,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    zIndex: 1,
  },
  // Mental - Top Right: left-[177px] top-[20px] with p-[8px]
  pillarMentalShadow: {
    position: 'absolute',
    left: 177,
    top: 20,
    width: 148,
    height: 101,
    // Drop shadow: Black100 + Black200, radius: Depth100/2 (2), offset: (0, Depth025/1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Depth025 = 1
    shadowOpacity: 0.15, // Combined opacity for both shadows
    shadowRadius: 2, // Depth100/2 = 2
    elevation: 2, // Android shadow
  },
  pillarMental: {
    width: 148,
    height: 101,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pillarContentMental: {
    position: 'absolute',
    right: 8,
    top: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: 10,
    zIndex: 1,
  },
  // Physical - Bottom Left: left-[22px] top-[128px] with p-[8px]
  pillarPhysicalShadow: {
    position: 'absolute',
    left: 22,
    top: 128,
    width: 148,
    height: 101,
    // Drop shadow: Black100 + Black200, radius: Depth100/2 (2), offset: (0, Depth025/1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Depth025 = 1
    shadowOpacity: 0.15, // Combined opacity for both shadows
    shadowRadius: 2, // Depth100/2 = 2
    elevation: 2, // Android shadow
  },
  pillarPhysical: {
    width: 148,
    height: 101,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pillarContentPhysical: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    zIndex: 1,
  },
  // Emotional - Bottom Right: left-[177px] top-[128px] with px-[8px] py-[5px]
  pillarEmotionalShadow: {
    position: 'absolute',
    left: 177,
    top: 128,
    width: 148,
    height: 101,
    // Drop shadow: Black100 + Black200, radius: Depth100/2 (2), offset: (0, Depth025/1)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Depth025 = 1
    shadowOpacity: 0.15, // Combined opacity for both shadows
    shadowRadius: 2, // Depth100/2 = 2
    elevation: 2, // Android shadow
  },
  pillarEmotional: {
    width: 148,
    height: 101,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pillarContentEmotional: {
    position: 'absolute',
    right: 8,
    bottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 2,
    zIndex: 1,
  },
  pillarShape: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  pillarText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.text,
    letterSpacing: 0.15,
    lineHeight: 22.4,
  },
  progressWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // On top of pillars
  },
  progressSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
  },
  textGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontFamily: Typography.fontFamily,
    fontSize: 34,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.warning,
    lineHeight: 40.8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  label: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.light.warning,
    lineHeight: 22,
    letterSpacing: 0.1,
    textAlign: 'center',
    marginTop: 2, // Small gap below percentage
  },
  button: {
    position: 'absolute',
    left: 20,
    top: 259,
    width: 307,
    height: 36,
    backgroundColor: Colors.light.primaryLight,
    borderRadius: BorderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 5, // Above pillars but below circle if needed
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.light.text,
    letterSpacing: 0.4,
    lineHeight: 24,
  },
});
