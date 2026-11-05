/**
 * Callback type for when the slider value changes.
 * @param value The new value of the slider.
 * @returns A promise that resolves when the value change is handled, or void.
 */
export type SliderValueChange = (value: number) => Promise<void> | void;

/**
 * Callback type for when the slider value updates during a pan gesture.
 * @param value The current value of the slider.
 */
export type SliderValueUpdate = (value: number) => void;

/**
 * Creates the animation that moves the slider's thumb into a step.
 * @param toValue The value to animate to.
 * @returns A Reanimated animation, e.g. `withSpring(toValue)`.
 */
export type SliderStepAnimation = (toValue: number) => number;
