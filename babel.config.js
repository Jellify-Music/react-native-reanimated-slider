export default (api) =>
  // Jest needs React Native's preset to parse react-native's own Flow source,
  // and the worklets plugin so Reanimated hooks run without a dependency array
  api.env('test')
    ? {
        presets: [
          ['module:@react-native/babel-preset', { enableBabelRuntime: false }],
        ],
        plugins: ['react-native-worklets/plugin'],
      }
    : { presets: ['react-native-builder-bob/babel-preset'] };
