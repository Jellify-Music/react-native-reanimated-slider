import { View, StyleSheet } from 'react-native';
import Slider from '@jellify-music/react-native-reanimated-slider';
import { useSharedValue } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

export default function App() {
  const value = useSharedValue(0);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.textContainer}>
        <Animated.Text style={styles.text}>
          Current Value: {value.value.toFixed(2)}
        </Animated.Text>
      </Animated.View>

      <Slider
        value={value}
        onValueChange={(val: number) => {
          console.info('Slider value:', val);
        }}
        maxValue={100}
        thumbWidth={20}
        trackHeight={10}
        backgroundColor="#ccc"
        color="#bb00ffe0"
        thumbShadowColor="#000"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
  },
});
