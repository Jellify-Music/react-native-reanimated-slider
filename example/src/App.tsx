import { View, StyleSheet, Text } from 'react-native';
import Slider from '@jellify-music/react-native-reanimated-slider';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';

export default function App() {
  const gestureActiveRef = useRef(false);

  const value = useSharedValue(0);

  const [state, setState] = useState('0.00');

  const onValueChange = async (val: number) => {
    console.log(val);
    setState(val.toFixed(2));
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
