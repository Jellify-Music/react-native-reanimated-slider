import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  fireGestureHandler,
  getByGestureTestId,
} from 'react-native-gesture-handler/jest-utils';
import { GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { makeMutable, type SharedValue } from 'react-native-reanimated';
import type { RefObject } from 'react';
import Slider from '../components/index';
import type { SliderOrientation } from '../types';

const TEST_ID = 'slider';
const SLIDER_LENGTH = 200;
const MAX_VALUE = 100;

interface RenderSliderOptions {
  orientation?: SliderOrientation;
  onValueChange?: jest.Mock;
  gestureActiveRef?: RefObject<boolean>;
  hitSlop?: number;
}

async function renderSlider({
  orientation = 'horizontal',
  onValueChange = jest.fn(async () => {}),
  gestureActiveRef,
  hitSlop,
}: RenderSliderOptions = {}) {
  const value: SharedValue<number> = makeMutable(0);

  await render(
    <Slider
      testID={TEST_ID}
      orientation={orientation}
      value={value}
      onValueChange={onValueChange}
      gestureActiveRef={gestureActiveRef}
      hitSlop={hitSlop}
      maxValue={MAX_VALUE}
      thumbWidth={10}
      trackHeight={4}
      backgroundColor="#ccc"
      color="#000"
    />,
    { wrapper: GestureHandlerRootView }
  );

  // Layout isn't measured under Jest, so report the slider's size manually
  await fireEvent(screen.getByTestId(TEST_ID), 'layout', {
    nativeEvent: {
      layout: {
        x: 0,
        y: 0,
        width: orientation === 'vertical' ? 8 : SLIDER_LENGTH,
        height: orientation === 'vertical' ? SLIDER_LENGTH : 8,
      },
    },
  });

  return { value, onValueChange };
}

// Lets the async gesture callbacks and `onValueChange` settle
const flushPromises = () =>
  new Promise<void>((resolve) => setImmediate(() => resolve()));

function tap(point: { x?: number; y?: number }) {
  fireGestureHandler(getByGestureTestId(`${TEST_ID}-tap`), [
    { state: State.BEGAN, ...point },
    { state: State.ACTIVE, ...point },
    { state: State.END, ...point },
  ]);
}

function pan(points: { x?: number; y?: number }[]) {
  const [first, ...rest] = points;
  const last = points[points.length - 1];

  fireGestureHandler(getByGestureTestId(`${TEST_ID}-pan`), [
    { state: State.BEGAN, ...first },
    { state: State.ACTIVE, ...first },
    ...rest.map((point) => ({ state: State.ACTIVE, ...point })),
    { state: State.END, ...last },
  ]);
}

describe('Slider', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('gesture to value mapping', () => {
    it.each([
      [0, 0],
      [50, 25],
      [100, 50],
      [200, 100],
    ])('horizontal tap at x=%d sets value %d', async (x, expected) => {
      const { value, onValueChange } = await renderSlider();

      tap({ x, y: 4 });
      await flushPromises();

      expect(value.value).toBe(expected);
      expect(onValueChange).toHaveBeenCalledWith(expected);
    });

    it.each([
      [0, 100],
      [50, 75],
      [100, 50],
      [200, 0],
    ])('vertical tap at y=%d sets value %d', async (y, expected) => {
      const { value, onValueChange } = await renderSlider({
        orientation: 'vertical',
      });

      tap({ x: 4, y });
      await flushPromises();

      expect(value.value).toBe(expected);
      expect(onValueChange).toHaveBeenCalledWith(expected);
    });

    it('ignores the y-coordinate when horizontal', async () => {
      const { value } = await renderSlider();

      tap({ x: 50, y: 150 });
      await flushPromises();

      expect(value.value).toBe(25);
    });

    it('ignores the x-coordinate when vertical', async () => {
      const { value } = await renderSlider({ orientation: 'vertical' });

      tap({ x: 150, y: 50 });
      await flushPromises();

      expect(value.value).toBe(75);
    });

    it('clamps positions outside the slider', async () => {
      const { value, onValueChange } = await renderSlider();

      tap({ x: 500, y: 4 });
      await flushPromises();

      expect(value.value).toBe(MAX_VALUE);
      expect(onValueChange).toHaveBeenCalledWith(MAX_VALUE);
    });
  });

  describe('pan', () => {
    it('tracks each update and reports only the final value', async () => {
      const onValueChange = jest.fn(async () => {});
      const { value } = await renderSlider({ onValueChange });
      const observed: number[] = [];
      value.addListener(1, (position) => observed.push(position));

      pan([{ x: 20 }, { x: 60 }, { x: 120 }, { x: 180 }]);
      await flushPromises();

      expect(observed).toEqual([10, 30, 60, 90]);
      expect(value.value).toBe(90);
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith(90);
    });

    it('tracks vertical pans from the bottom up', async () => {
      const onValueChange = jest.fn(async () => {});
      const { value } = await renderSlider({
        orientation: 'vertical',
        onValueChange,
      });

      pan([{ y: 180 }, { y: 100 }, { y: 20 }]);
      await flushPromises();

      expect(value.value).toBe(90);
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith(90);
    });
  });

  describe('gestureActiveRef', () => {
    it('is true during a gesture and resets 100ms after release', async () => {
      jest.useFakeTimers();
      const gestureActiveRef = { current: false };
      let activeDuringGesture: boolean | undefined;

      const onValueChange = jest.fn(async () => {
        activeDuringGesture = gestureActiveRef.current;
      });
      await renderSlider({ gestureActiveRef, onValueChange });

      tap({ x: 100 });
      await jest.advanceTimersByTimeAsync(0);

      expect(activeDuringGesture).toBe(true);
      expect(gestureActiveRef.current).toBe(true);

      await jest.advanceTimersByTimeAsync(99);
      expect(gestureActiveRef.current).toBe(true);

      await jest.advanceTimersByTimeAsync(1);
      expect(gestureActiveRef.current).toBe(false);
    });
  });

  describe('onValueChange rejecting', () => {
    it('logs the error instead of throwing and still resets the ref', async () => {
      jest.useFakeTimers();
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('Seek failed');
      const gestureActiveRef = { current: false };

      await renderSlider({
        gestureActiveRef,
        onValueChange: jest.fn(async () => {
          throw error;
        }),
      });

      tap({ x: 100 });
      await jest.advanceTimersByTimeAsync(100);

      expect(consoleError).toHaveBeenCalledWith(
        'Error updating Reanimated Slider value:',
        error
      );
      expect(gestureActiveRef.current).toBe(false);
    });
  });

  describe('cancelled tap', () => {
    it('does not call onValueChange', async () => {
      const { onValueChange } = await renderSlider();

      fireGestureHandler(getByGestureTestId(`${TEST_ID}-tap`), [
        { state: State.BEGAN, x: 100 },
        { state: State.CANCELLED, x: 100 },
      ]);
      await flushPromises();

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('touch area', () => {
    it('lays out the hit slop around a horizontal track without changing its size', async () => {
      await renderSlider({ hitSlop: 30 });

      expect(screen.getByTestId(TEST_ID)).toHaveStyle({
        height: 68,
        paddingVertical: 34,
        marginVertical: -30,
      });
    });

    it('lays out the hit slop around a vertical track without changing its size', async () => {
      await renderSlider({ orientation: 'vertical', hitSlop: 30 });

      expect(screen.getByTestId(TEST_ID)).toHaveStyle({
        width: 68,
        paddingHorizontal: 34,
        marginHorizontal: -30,
      });
    });
  });
});
