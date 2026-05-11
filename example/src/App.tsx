import { View, StyleSheet } from 'react-native';
import Slider from '@jellify-music/react-native-reanimated-slider';
import { useSharedValue } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRef } from 'react';

export default function App() {
  const gestureActiveRef = useRef(false);

  const value = useSharedValue(0);

  const onValueChange = (val: number) => {
    console.log(val);
    value.value = val;
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Animated.View style={styles.textContainer}>
          <Animated.Text style={styles.text}>
            Current Value: {value.value.toFixed(2)}
          </Animated.Text>
        </Animated.View>

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
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
  },
});
