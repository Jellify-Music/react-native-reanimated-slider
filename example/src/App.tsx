import { View, StyleSheet } from 'react-native';
import Slider from '@jellify-music/react-native-reanimated-slider';
import { useSharedValue } from 'react-native-reanimated';

export default function App() {
  const value = useSharedValue(0);

  return (
    <View style={styles.container}>
      <Slider
        value={value}
        onValueChange={(val: number) => {
          console.log('Slider value:', val);
        }}
        maxValue={100}
        thumbWidth={40}
        backgroundColor="#ccc"
        color="#bb00ffe0"
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
});
