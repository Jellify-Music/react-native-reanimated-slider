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
 * Calculates the slider position based on the y-coordinate.
 * Vertical sliders fill from bottom to top, so a y-coordinate of 0
 * (the top edge) maps to the maximum value.
 *
 * @param y The y-coordinate
 * @param height The height of the slider
 * @param maxValue The maximum value of the slider
 * @returns The calculated slider position
 */
export function sliderPositionFromY(
  y: number,
  height: number,
  maxValue: number
): number {
  return sliderPositionFromX(height - y, height, maxValue);
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

/**
 * Snaps a position to the nearest multiple of `step`, clamped between 0 and
 * the maximum value. Returns the position unchanged when `step` isn't positive.
 *
 * @param position The current slider position
 * @param step The interval between selectable values
 * @param maxValue The maximum value of the slider
 * @returns The snapped slider value
 */
export function snapToStep(
  position: number,
  step: number | undefined,
  maxValue: number
): number {
  if (!step || step <= 0) {
    return position;
  }

  // Round off floating point error from fractional steps, e.g. 3 * 0.1
  const snapped = parseFloat((Math.round(position / step) * step).toFixed(10));

  return clampValue(snapped, maxValue);
}
