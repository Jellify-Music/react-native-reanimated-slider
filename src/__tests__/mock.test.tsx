import { fireEvent, render, screen } from '@testing-library/react-native';
import { makeMutable } from 'react-native-reanimated';
import { SliderOrientations } from '../enums';

// Typed against src since mock.d.ts points at the build output
const mock = jest.requireActual<typeof import('../index')>('../../mock');
const MockSlider = mock.default;

describe('mock', () => {
  it('exports the same orientations as the library', () => {
    expect(mock.SliderOrientations).toEqual(SliderOrientations);
  });

  it('renders a view exposing the testID and value', async () => {
    await render(
      <MockSlider
        testID="slider"
        value={makeMutable(25)}
        maxValue={100}
        onValueChange={() => {}}
        thumbWidth={10}
        trackHeight={4}
        backgroundColor="#ccc"
        color="#000"
      />
    );

    expect(screen.getByTestId('slider')).toHaveProp('accessibilityValue', {
      min: 0,
      max: 100,
      now: 25,
    });
  });

  it('exposes a number value', async () => {
    await render(
      <MockSlider
        testID="slider"
        value={25}
        maxValue={100}
        onValueChange={() => {}}
        thumbWidth={10}
        trackHeight={4}
        backgroundColor="#ccc"
        color="#000"
      />
    );

    expect(screen.getByTestId('slider')).toHaveProp('accessibilityValue', {
      min: 0,
      max: 100,
      now: 25,
    });
  });

  it('forwards valueChange events to onValueChange', async () => {
    const onValueChange = jest.fn();

    await render(
      <MockSlider
        testID="slider"
        value={makeMutable(0)}
        maxValue={100}
        onValueChange={onValueChange}
        thumbWidth={10}
        trackHeight={4}
        backgroundColor="#ccc"
        color="#000"
      />
    );

    await fireEvent(screen.getByTestId('slider'), 'valueChange', 42);

    expect(onValueChange).toHaveBeenCalledWith(42);
  });

  it('forwards valueUpdate events to onValueUpdate', async () => {
    const onValueUpdate = jest.fn();

    await render(
      <MockSlider
        testID="slider"
        value={makeMutable(0)}
        maxValue={100}
        onValueChange={() => {}}
        onValueUpdate={onValueUpdate}
        thumbWidth={10}
        trackHeight={4}
        backgroundColor="#ccc"
        color="#000"
      />
    );

    await fireEvent(screen.getByTestId('slider'), 'valueUpdate', 42);

    expect(onValueUpdate).toHaveBeenCalledWith(42);
  });
});
