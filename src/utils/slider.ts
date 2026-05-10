/**
 * Clamps a value between a minimum and maximum range.
 *
 * @param value The value to clamp
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @returns The clamped value, guaranteed to be between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates the slider position based on the x-coordinate.
 *
 * @param x The x-coordinate
 * @param width The width of the slider
 * @param maxValue The maximum value of the slider
 * @returns The calculated slider position
 */
export function sliderPositionFromX(
  x: number,
  width: number,
  maxValue: number
): number {
  if (width <= 0 || maxValue <= 0) {
    return 0;
  }

  return clamp((x / width) * maxValue, 0, maxValue);
}

/**
 * Clamps the slider value between 0 and the maximum value.
 *
 * @param position The current slider position
 * @param maxValue The maximum value of the slider
 * @returns The clamped slider value
 */
export function clampValue(position: number, maxValue: number): number {
  return clamp(position, 0, maxValue);
}
