import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import {
  GestureDetector,
  useCompetingGestures,
  useNativeGesture,
  usePanGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import { HIT_SLOP } from './config';
import {
  clampValue,
  sliderPositionFromX,
  sliderPositionFromY,
} from './utils/slider';
import type { RefObject } from 'react';
import type { SliderOrientation } from './types';

interface SliderProps {
  onValueChange: (value: number) => Promise<void>;
  maxValue: number;
  value: SharedValue<number>;
  thumbWidth: number;
  thumbShadowColor?: string;
  trackHeight: number;
  backgroundColor: string;
  color: string;
  gestureActiveRef?: RefObject<boolean>;
  hitSlop?: number;
  orientation?: SliderOrientation;
  testID?: string;
}

export default function Slider({
  onValueChange,
  value,
  thumbWidth,
  trackHeight,
  backgroundColor,
  color,
  thumbShadowColor,
  maxValue,
  gestureActiveRef,
  hitSlop,
  orientation = 'horizontal',
  testID,
}: SliderProps) {
  const isVertical = orientation === 'vertical';

  // Width of a horizontal slider, or height of a vertical one
  const sliderLength = useSharedValue(0);

  const positionFromEvent = ({ x, y }: { x: number; y: number }) =>
    isVertical
      ? sliderPositionFromY(y, sliderLength.value, maxValue)
      : sliderPositionFromX(x, sliderLength.value, maxValue);

  const handleValueChange = async (position: number) => {
    const clampedValue = clampValue(position, maxValue);

    try {
      await onValueChange(clampedValue);
    } catch (error) {
      console.error('Error updating Reanimated Slider value:', error);
    } finally {
      setTimeout(() => {
        if (gestureActiveRef) {
          gestureActiveRef.current = false;
        }
      }, 100);
    }
  };

  const panGesture = usePanGesture({
    runOnJS: true,
    testID,
    hitSlop: hitSlop ?? HIT_SLOP,
    onActivate: (event) => {
      if (gestureActiveRef) {
        gestureActiveRef.current = true;
      }

      value.set(positionFromEvent(event));
    },
    onUpdate: (event) => {
      value.set(positionFromEvent(event));
    },
    onDeactivate: async (event) => {
      const position = positionFromEvent(event);

      value.set(position);

      await handleValueChange(position);
    },
  });

  const tapGesture = useTapGesture({
    runOnJS: true,
    testID,
    hitSlop: hitSlop ?? HIT_SLOP,
    onBegin: (event) => {
      if (gestureActiveRef) {
        gestureActiveRef.current = true;
      }

      value.set(positionFromEvent(event));
    },
    onFinalize: async (event) => {
      if (event.canceled) return;

      const position = positionFromEvent(event);

      value.set(position);

      await handleValueChange(position);
    },
  });

  const nativeGesture = useNativeGesture();

  const slideGesture = useSimultaneousGestures(tapGesture, panGesture);

  const gesture = useCompetingGestures(slideGesture, nativeGesture);

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const thumbRange = sliderLength.value - thumbWidth;

    return {
      transform: isVertical
        ? [
            {
              translateY: interpolate(
                value.value,
                [0, maxValue],
                [thumbRange, 0],
                Extrapolation.CLAMP
              ),
            },
          ]
        : [
            {
              translateX: interpolate(
                value.value,
                [0, maxValue],
                [0, thumbRange],
                Extrapolation.CLAMP
              ),
            },
          ],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const progressLength = interpolate(
      value.value,
      [0, maxValue],
      [0, sliderLength.value],
      Extrapolation.CLAMP
    );

    return isVertical ? { height: progressLength } : { width: progressLength };
  });

  const measure = (event: LayoutChangeEvent) => {
    'worklet';
    const { width, height } = event.nativeEvent.layout;
    sliderLength.value = isVertical ? height : width;
  };

  const trackStyle = isVertical
    ? [styles.verticalTrack, { width: trackHeight }]
    : [styles.horizontalTrack, { height: trackHeight }];

  // Vertical progress is anchored to the bottom so it fills upwards
  const progressTrackStyle = isVertical
    ? [styles.verticalProgressTrack, { width: trackHeight }]
    : trackStyle;

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={
          isVertical
            ? {
                ...styles.verticalContainer,
                width: trackHeight * 2,
                paddingHorizontal: trackHeight,
              }
            : {
                ...styles.horizontalContainer,
                height: trackHeight * 2,
                paddingVertical: trackHeight,
              }
        }
        onLayout={measure}
        testID={testID}
      >
        {/* Background Track */}
        <View
          style={[
            trackStyle,
            {
              backgroundColor,
              borderRadius: trackHeight / 2,
            },
          ]}
        />

        {/* Progress Track */}
        <Animated.View
          style={[
            progressTrackStyle,
            {
              backgroundColor: color,
              borderRadius: trackHeight / 2,
            },
            progressAnimatedStyle,
          ]}
        />

        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            isVertical && styles.verticalThumb,
            {
              width: thumbWidth,
              height: thumbWidth,
              borderRadius: thumbWidth / 2,
              backgroundColor: color,
              shadowColor: thumbShadowColor,
              shadowOffset: thumbShadowColor
                ? {
                    width: 0,
                    height: thumbWidth / 2,
                  }
                : undefined,
              shadowRadius: thumbShadowColor ? thumbWidth / 2 : undefined,
            },
            thumbAnimatedStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  verticalContainer: {
    position: 'relative',
    height: '100%',
    alignItems: 'center',
  },
  horizontalTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
  },
  verticalTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: '100%',
  },
  verticalProgressTrack: {
    position: 'absolute',
    bottom: 0,
  },
  thumb: {
    position: 'absolute',
    shadowOpacity: 0.75,
  },
  verticalThumb: {
    top: 0,
  },
});
