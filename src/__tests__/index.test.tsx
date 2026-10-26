import {
  clampValue,
  sliderPositionFromX,
  sliderPositionFromY,
} from '../utils/slider';

describe('slider utils', () => {
  describe('clampValue', () => {
    it('returns 0 for negative values', () => {
      expect(clampValue(-10, 100)).toBe(0);
    });

    it('returns maxValue for values above the maximum', () => {
      expect(clampValue(150, 100)).toBe(100);
    });

    it('returns the original value when it is within bounds', () => {
      expect(clampValue(42, 100)).toBe(42);
    });
  });

  describe('sliderPositionFromX', () => {
    it('returns 0 when width is zero', () => {
      expect(sliderPositionFromX(20, 0, 100)).toBe(0);
    });

    it('calculates a proportional slider value', () => {
      expect(sliderPositionFromX(25, 100, 200)).toBe(50);
    });

    it('clamps to maxValue when x exceeds width', () => {
      expect(sliderPositionFromX(150, 100, 80)).toBe(80);
    });

    it('clamps to 0 when x is negative', () => {
      expect(sliderPositionFromX(-20, 100, 80)).toBe(0);
    });
  });

  describe('sliderPositionFromY', () => {
    it('returns 0 when height is zero', () => {
      expect(sliderPositionFromY(20, 0, 100)).toBe(0);
    });

    it('returns maxValue at the top edge', () => {
      expect(sliderPositionFromY(0, 100, 80)).toBe(80);
    });

    it('returns 0 at the bottom edge', () => {
      expect(sliderPositionFromY(100, 100, 80)).toBe(0);
    });

    it('calculates a proportional slider value from the bottom', () => {
      expect(sliderPositionFromY(25, 100, 200)).toBe(150);
    });

    it('clamps to maxValue when y is above the slider', () => {
      expect(sliderPositionFromY(-20, 100, 80)).toBe(80);
    });

    it('clamps to 0 when y is below the slider', () => {
      expect(sliderPositionFromY(150, 100, 80)).toBe(0);
    });
  });
});
