import * as React from 'react';

import { View, TouchableOpacity, Text, AppState } from 'react-native';
import { START_APP } from 'rn-start-app-tcp';

export default function App() {
  const appState = React.useRef(AppState.currentState);
  React.useEffect(() => {
    START_APP.sideEffectListener();
    START_APP.registerPackageName('com.rnstartapptcpexample');
    START_APP.getAppState(appState, () => {
      console.log('hello');
      //use lib restart app in here
    });
  }, []);
  // use this function will not open app
  const quitApp = () => {
    START_APP.quitApp();
  };
  return (
    <View
      style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}
    >
      <TouchableOpacity onPress={quitApp}>
        <Text>test</Text>
      </TouchableOpacity>
    </View>
  );
}
