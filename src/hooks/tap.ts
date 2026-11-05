import { useTapGesture } from 'react-native-gesture-handler';
import type { SliderGestureParams } from '../types/gestures';

export const useSliderTapGesture = ({
  testID,
  mainAxisHitSlop,
  gestureActiveRef,
  moveTo,
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

      moveTo(positionFromEvent(event));
    },
    onFinalize: async (event) => {
      if (event.canceled) return;

      const position = moveTo(positionFromEvent(event), true);

      await handleValueChange(position);
    },
  });
