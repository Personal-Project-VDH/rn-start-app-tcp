import * as React from 'react';

import { View } from 'react-native';
import { CONSTANTS, START_APP } from 'rn-start-app-tcp';

var interval_send: any;
var timeout_connect: any;

export default function App() {
  React.useEffect(() => {
    START_APP.listenEvent('close', (event: any) => {
      START_APP.registerPackageName('com.washingapp');
      console.log(event, ' close');
    });
    START_APP.listenEvent('connect', (event: any) => {
      if (event.code === CONSTANTS.REGISTER_PACKAGE_SUCCESS) {
        START_APP.connectToServer();
      } else if (event.code === CONSTANTS.CONNECT_SUCCESS) {
        sendToKeepConnect();
      }
      console.log(event, 'connect');
    });
    START_APP.listenEvent('connected', (event: any) => {
      console.log(event, 'connected');
      if (event.code === CONSTANTS.SERVER_REFUSED) {
        reconnectFunction();
      }
    });

    START_APP.listenEvent('error', (event: any) => {
      console.log(event, 'error');
    });
  }, []);

  const sendToKeepConnect = () => {
    clearTimeout(timeout_connect);
    clearInterval(interval_send);
    START_APP.sendToServer(CONSTANTS.OPEN_START);
    interval_send = setInterval(() => {
      START_APP.sendToServer(CONSTANTS.OPEN_START);
    }, 2000);
  };

  const reconnectFunction = () => {
    timeout_connect = setTimeout(() => {
      START_APP.connectToServer();
    }, 2000);
  };

  return (
    <View
      style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}
    ></View>
  );
}
