import { HIT_SLOP } from '../configs';
import useSliderPanGesture from '../hooks/pan';
import { SliderOrientations } from '../enums';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  GestureDetector,
  useCompetingGestures,
  useNativeGesture,
  useSimultaneousGestures,
} from 'react-native-gesture-handler';
import {
  clampValue,
  sliderPositionFromX,
  sliderPositionFromY,
  snapToStep,
} from '../utils/slider';
import type { HitSlop } from '../types';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { useSliderTapGesture } from '../hooks/tap';
import useSliderValue from '../hooks/value';
import type { SliderProps } from '../types/props';
import { useRef } from 'react';

export default function Slider({
  onValueChange,
  onValueUpdate,
  value: valueProp,
  thumbWidth,
  trackHeight,
  backgroundColor,
  color,
  thumbShadowColor,
  maxValue,
  step,
  gestureActiveRef,
  hitSlop = HIT_SLOP,
  orientation = SliderOrientations.Horizontal,
  testID,
}: SliderProps) {
  const isVertical = orientation === SliderOrientations.Vertical;

  // Track gestures internally when the consumer doesn't provide a ref
  const internalGestureActiveRef = useRef(false);
  const activeGestureRef = gestureActiveRef ?? internalGestureActiveRef;

  const value = useSliderValue(valueProp, activeGestureRef);

  // Width of a horizontal slider, or height of a vertical one
  const sliderLength = useSharedValue(0);

  const positionFromEvent = ({ x, y }: { x: number; y: number }) =>
    snapToStep(
      isVertical
        ? sliderPositionFromY(y, sliderLength.value, maxValue)
        : sliderPositionFromX(x, sliderLength.value, maxValue),
      step,
      maxValue
    );

  /**
   * Main axis hit slop for the slider gesture.
   * Top and bottom for vertical sliders, left and right for horizontal sliders
   */
  const mainAxisHitSlop: HitSlop = isVertical
    ? { top: hitSlop, bottom: hitSlop }
    : { left: hitSlop, right: hitSlop };

  const handleValueChange = async (position: number) => {
    const clampedValue = clampValue(position, maxValue);

    try {
      await onValueChange(clampedValue);
    } catch (error) {
      console.error('Error updating Reanimated Slider value:', error);
    } finally {
      setTimeout(() => {
        activeGestureRef.current = false;
      }, 100);
    }
  };

  const panGesture = useSliderPanGesture({
    testID,
    mainAxisHitSlop: mainAxisHitSlop,
    gestureActiveRef: activeGestureRef,
    value,
    positionFromEvent,
    handleValueChange,
    onValueUpdate,
  });

  const tapGesture = useSliderTapGesture({
    testID,
    mainAxisHitSlop: mainAxisHitSlop,
    gestureActiveRef: activeGestureRef,
    value,
    positionFromEvent,
    handleValueChange,
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
                width: (trackHeight + hitSlop) * 2,
                paddingHorizontal: trackHeight + hitSlop,
                marginHorizontal: -hitSlop,
              }
            : {
                ...styles.horizontalContainer,
                height: (trackHeight + hitSlop) * 2,
                paddingVertical: trackHeight + hitSlop,
                marginVertical: -hitSlop,
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
