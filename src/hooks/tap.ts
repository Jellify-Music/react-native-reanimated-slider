import { useTapGesture } from 'react-native-gesture-handler';
import type { SliderGestureParams } from '../types/gestures';

export const useSliderTapGesture = ({
  testID,
  mainAxisHitSlop,
  gestureActiveRef,
  value,
  positionFromEvent,
  handleValueChange,
}: SliderGestureParams) =>
  useTapGesture({
    runOnJS: true,
    testID: testID && `${testID}-tap`,
    hitSlop: mainAxisHitSlop,
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
