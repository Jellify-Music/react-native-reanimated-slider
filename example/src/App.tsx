import { View, StyleSheet, Text } from 'react-native';
import Slider, {
  type SliderStepAnimation,
} from '@jellify-music/react-native-reanimated-slider';
import {
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRef, useState, type RefObject } from 'react';

const bouncySpring: SliderStepAnimation = (toValue) => {
  'worklet';
  return withSpring(toValue, { stiffness: 300, damping: 8, mass: 0.6 });
};

const quickTiming: SliderStepAnimation = (toValue) => {
  'worklet';
  return withTiming(toValue, { duration: 120 });
};

const noAnimation: SliderStepAnimation = (toValue) => toValue;

type StepExampleProps = {
  label: string;
  step: number;
  stepResistance?: number;
  stepAnimation?: SliderStepAnimation;
  gestureActiveRef: RefObject<boolean>;
};

function StepExample({
  label,
  gestureActiveRef,
  ...stepProps
}: StepExampleProps) {
  const value = useSharedValue(0);

  const [state, setState] = useState('0');

  const onValueChange = async (val: number) => {
    console.log(label, val);
    setState(val.toString());
  };

  return (
    <>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {label}: {state}
        </Text>
      </View>

      <Slider
        {...stepProps}
        value={value}
        onValueChange={onValueChange}
        gestureActiveRef={gestureActiveRef}
        maxValue={100}
        thumbWidth={10}
        trackHeight={5}
        backgroundColor="#ccc"
        color="#bb00ffe0"
        thumbShadowColor="#000"
      />
    </>
  );
}

export default function App() {
  const gestureActiveRef = useRef(false);

  const value = useSharedValue(0);
  const verticalValue = useSharedValue(0);

  const [state, setState] = useState('0.00');
  const [verticalState, setVerticalState] = useState('0.00');

  const onValueChange = async (val: number) => {
    console.log(val);
    setState(val.toFixed(2));
  };

  const onVerticalValueChange = async (val: number) => {
    console.log(val);
    setVerticalState(val.toFixed(2));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Value: {state}</Text>
        </View>

        <Slider
          value={value}
          onValueChange={onValueChange}
          gestureActiveRef={gestureActiveRef}
          maxValue={100}
          thumbWidth={10}
          trackHeight={5}
          backgroundColor="#ccc"
          color="#bb00ffe0"
          thumbShadowColor="#000"
        />

        <StepExample
          label="Stepped (default spring)"
          step={10}
          gestureActiveRef={gestureActiveRef}
        />

        <StepExample
          label="Stepped (bouncy, loose)"
          step={20}
          stepResistance={0.6}
          stepAnimation={bouncySpring}
          gestureActiveRef={gestureActiveRef}
        />

        <StepExample
          label="Stepped (timing)"
          step={25}
          stepAnimation={quickTiming}
          gestureActiveRef={gestureActiveRef}
        />

        <StepExample
          label="Stepped (ratchet)"
          step={10}
          stepResistance={0}
          stepAnimation={noAnimation}
          gestureActiveRef={gestureActiveRef}
        />

        <View style={styles.textContainer}>
          <Text style={styles.text}>Vertical Value: {verticalState}</Text>
        </View>

        <View style={styles.verticalSliderContainer}>
          <Slider
            orientation="vertical"
            value={verticalValue}
            onValueChange={onVerticalValueChange}
            gestureActiveRef={gestureActiveRef}
            maxValue={100}
            thumbWidth={10}
            trackHeight={5}
            backgroundColor="#ccc"
            color="#bb00ffe0"
            thumbShadowColor="#000"
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  textContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  verticalSliderContainer: {
    height: 200,
  },
  text: {
    fontSize: 18,
  },
});
