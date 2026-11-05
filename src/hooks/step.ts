import {
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import type { SliderStepAnimation } from '../types/events';
import { clampValue, snapToStep } from '../utils/slider';

type SliderStepParams = {
  value: SharedValue<number>;
  maxValue: number;
  step?: number;
  stepResistance: number;
  stepAnimation: SliderStepAnimation;
};

/**
 * Moves the slider's value, giving stepped sliders some springiness.
 *
 * Between steps, the thumb is pulled towards the user's finger by a fraction
 * of the distance (`stepResistance`). Once the finger passes the midpoint into
 * another step, the thumb is animated into it with `stepAnimation`, and it
 * springs back onto its step when released.
 *
 * `value` only ever holds snapped values; the springiness lives in the
 * returned `displayValue`, which the thumb and progress track render.
 */
export default function useSliderStep({
  value,
  maxValue,
  step,
  stepResistance,
  stepAnimation,
}: SliderStepParams) {
  const isStepped = !!step && step > 0;

  // Animates the thumb from where it was into its new step
  const spring = useSharedValue(0);

  // Resisted distance from the value's step towards the user's finger
  const pull = useSharedValue(0);

  const displayValue = useDerivedValue(() =>
    clampValue(value.value + spring.value + pull.value, maxValue)
  );

  /**
   * Moves the slider towards a raw gesture position.
   *
   * @param position The unsnapped gesture position
   * @param released Whether the gesture has ended, settling the thumb on its step
   * @returns The snapped value
   */
  const moveTo = (position: number, released = false) => {
    if (!isStepped) {
      value.set(position);
      return position;
    }

    const snapped = snapToStep(position, step, maxValue);
    const nextPull = released ? 0 : (position - snapped) * stepResistance;
    const previous = value.get();

    if (snapped !== previous || released) {
      // Keep the thumb where it is on screen, then animate it into the step
      spring.set(previous + spring.get() + pull.get() - snapped - nextPull);
      spring.set(stepAnimation(0));
    }

    pull.set(nextPull);
    value.set(snapped);

    return snapped;
  };

  return { displayValue, moveTo };
}
