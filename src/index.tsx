import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { HIT_SLOP } from './config';
import { useRef } from 'react';

interface SliderProps {
  onValueChange: (value: number) => void;
  maxValue: number;
  value: SharedValue<number>;
  thumbWidth: number;
  backgroundColor: string;
  color: string;
}

export default function Slider({
  onValueChange,
  value,
  thumbWidth,
  backgroundColor,
  color,
  maxValue,
}: SliderProps) {
  const isInteractingRef = useRef(false);
  const sliderWidthRef = useRef(0);
  const sliderThumbWidthRef = useRef(0);
  const sliderXOffsetRef = useRef(0);

  const handleValueChange = async (position: number) => {
    const clampedValue = Math.max(0, Math.min(position, maxValue));

    try {
      await onValueChange(clampedValue);
    } catch (error) {
      console.error('Error updating Reanimated Slider value:', error);
    } finally {
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 100);
    }
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .hitSlop(HIT_SLOP)
    .onStart((event) => {
      isInteractingRef.current = true;

      const relativeX = event.absoluteX - sliderXOffsetRef.current;
      const clampedX = Math.max(0, Math.min(relativeX, sliderWidthRef.current));
      const position = interpolate(
        clampedX,
        [0, sliderWidthRef.current],
        [0, maxValue],
        Extrapolation.CLAMP
      );
      value.set(position);
    })
    .onUpdate((event) => {
      if (isInteractingRef.current) {
        const relativeX = event.absoluteX - sliderXOffsetRef.current;
        const clampedX = Math.max(
          0,
          Math.min(relativeX, sliderWidthRef.current)
        );
        const position = interpolate(
          clampedX,
          [0, sliderWidthRef.current],
          [0, maxValue],
          Extrapolation.CLAMP
        );
        value.set(position);
      }
    })
    .onEnd(async (event) => {
      const relativeX = event.absoluteX - sliderXOffsetRef.current;
      const clampedX = Math.max(0, Math.min(relativeX, sliderWidthRef.current));
      const position = interpolate(
        clampedX,
        [0, sliderWidthRef.current],
        [0, maxValue],
        Extrapolation.CLAMP
      );

      value.set(position);

      await handleValueChange(position);
    });

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .hitSlop(HIT_SLOP)
    .onBegin((event) => {
      isInteractingRef.current = true;

      const relativeX = event.absoluteX - sliderXOffsetRef.current;
      const clampedX = Math.max(0, Math.min(relativeX, sliderWidthRef.current));

      const position = interpolate(
        clampedX,
        [0, sliderWidthRef.current],
        [0, maxValue],
        Extrapolation.CLAMP
      );

      value.set(position);
    })
    .onFinalize(async (event, success) => {
      if (!success) return;

      const relativeX = event.absoluteX - sliderXOffsetRef.current;
      const clampedX = Math.max(0, Math.min(relativeX, sliderWidthRef.current));
      const position = interpolate(
        clampedX,
        [0, sliderWidthRef.current],
        [0, maxValue],
        Extrapolation.CLAMP
      );

      value.set(position);

      await handleValueChange(position);
    });

  const nativeGesture = Gesture.Native();

  const slideGesture = Gesture.Simultaneous(tapGesture, panGesture);

  const gesture = Gesture.Race(slideGesture, nativeGesture);

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          value.value,
          [0, maxValue],
          [0, sliderWidthRef.current - sliderThumbWidthRef.current],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(
      value.value,
      [0, maxValue],
      [0, sliderWidthRef.current],
      Extrapolation.CLAMP
    ),
  }));

  const measureLayout = (event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    sliderWidthRef.current = width;

    sliderXOffsetRef.current = x;
  };

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={[
          styles.container,
          {
            height: thumbWidth,
            width: '100%',
            alignItems: 'stretch',
          },
        ]}
        onLayout={measureLayout}
      >
        {/* Background Track */}
        <View
          style={[
            styles.track,
            {
              height: thumbWidth,
              width: '100%',
              backgroundColor,
              borderRadius: thumbWidth / 2,
            },
          ]}
        />

        {/* Progress Track */}
        <Animated.View
          style={[
            styles.track,
            {
              height: thumbWidth,
              backgroundColor: color,
              borderRadius: thumbWidth / 2,
            },
            progressAnimatedStyle,
          ]}
        />

        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbWidth,
              height: thumbWidth,
              borderRadius: thumbWidth / 2,
              backgroundColor: color,
            },
            thumbAnimatedStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  thumb: {
    position: 'absolute',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
