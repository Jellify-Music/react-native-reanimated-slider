import { renderHook } from '@testing-library/react-native';
import { makeMutable, type SharedValue } from 'react-native-reanimated';
import useSliderValue from '../hooks/value';

describe('useSliderValue', () => {
  it('returns a shared value as is', async () => {
    const value = makeMutable(25);

    const { result } = await renderHook(() =>
      useSliderValue(value, { current: false })
    );

    expect(result.current).toBe(value);
  });

  it('mirrors a number into a shared value', async () => {
    const { result } = await renderHook(() =>
      useSliderValue(25, { current: false })
    );

    expect(result.current.value).toBe(25);
  });

  it('syncs the shared value when the number changes', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: number }) =>
        useSliderValue(value, { current: false }),
      { initialProps: { value: 25 } }
    );
    const sharedValue: SharedValue<number> = result.current;

    await rerender({ value: 75 });

    expect(result.current).toBe(sharedValue);
    expect(sharedValue.value).toBe(75);
  });

  it('ignores number changes during a gesture', async () => {
    const gestureActiveRef = { current: false };
    const { result, rerender } = await renderHook(
      ({ value }: { value: number }) => useSliderValue(value, gestureActiveRef),
      { initialProps: { value: 25 } }
    );

    gestureActiveRef.current = true;
    result.current.set(60);
    await rerender({ value: 30 });

    expect(result.current.value).toBe(60);

    gestureActiveRef.current = false;
    await rerender({ value: 35 });

    expect(result.current.value).toBe(35);
  });
});
