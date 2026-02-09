import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { HIT_SLOP } from './config';

interface SliderProps {
  onValueChange: (value: number) => void;
  maxValue: number;
  value: SharedValue<number>;
  thumbWidth: number;
  thumbShadowColor?: string;
  trackHeight: number;
  backgroundColor: string;
  color: string;
  gestureActiveRef?: React.RefObject<boolean>;
  hitSlop?: number;
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
}: SliderProps) {
  const sliderWidth = useSharedValue(0);

  const handleValueChange = async (position: number) => {
    const clampedValue = Math.max(0, Math.min(position, maxValue));

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

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .hitSlop(hitSlop ?? HIT_SLOP)
    .onStart((event) => {
      if (gestureActiveRef) {
        gestureActiveRef.current = true;
      }

      const clampedX = Math.max(0, Math.min(event.x, sliderWidth.value));
      const position = interpolate(
        clampedX,
        [0, sliderWidth.value],
        [0, maxValue],
        Extrapolation.CLAMP
      );
      value.set(position);
    })
    .onUpdate((event) => {
      const clampedX = Math.max(0, Math.min(event.x, sliderWidth.value));
      const position = interpolate(
        clampedX,
        [0, sliderWidth.value],
        [0, maxValue],
        Extrapolation.CLAMP
      );
      value.set(position);
    })
    .onEnd(async (event) => {
      const clampedX = Math.max(0, Math.min(event.x, sliderWidth.value));
      const position = interpolate(
        clampedX,
        [0, sliderWidth.value],
        [0, maxValue],
        Extrapolation.CLAMP
      );

      value.set(position);

      await handleValueChange(position);
    });

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .hitSlop(hitSlop ?? HIT_SLOP)
    .onBegin((event) => {
      if (gestureActiveRef) {
        gestureActiveRef.current = true;
      }

      const clampedX = Math.max(0, Math.min(event.x, sliderWidth.value));

      const position = interpolate(
        clampedX,
        [0, sliderWidth.value],
        [0, maxValue],
        Extrapolation.CLAMP
      );

      value.set(position);
    })
    .onFinalize(async (event, success) => {
      if (!success) return;

      const clampedX = Math.max(0, Math.min(event.x, sliderWidth.value));
      const position = interpolate(
        clampedX,
        [0, sliderWidth.value],
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
          [0, sliderWidth.value - thumbWidth],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(
      value.value,
      [0, maxValue],
      [0, sliderWidth.value],
      Extrapolation.CLAMP
    ),
  }));

  const measure = (event: LayoutChangeEvent) => {
    'worklet';
    sliderWidth.value = event.nativeEvent.layout.width;
  };

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={{
          ...styles.container,
          height: trackHeight * 2,
          paddingVertical: trackHeight,
        }}
        onLayout={measure}
      >
        {/* Background Track */}
        <View
          style={[
            styles.track,
            {
              height: trackHeight,
              width: '100%',
              backgroundColor,
              borderRadius: trackHeight / 2,
            },
          ]}
        />

        {/* Progress Track */}
        <Animated.View
          style={[
            styles.track,
            {
              height: trackHeight,
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
  container: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  thumb: {
    position: 'absolute',
    shadowOpacity: 0.75,
  },
});
