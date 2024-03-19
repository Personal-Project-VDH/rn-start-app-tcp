import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {START_APP} from "rn-start-app-tcp"

const OPEN_START = 0;
const CLOSE_START = -1;
const SOCKET_CLOSE = -1;
const SOCKET_NULL = -2;

// CONNECT
const WAS_CONNECTED = 0;
const REGISTER_PACKAGE_SUCCESS = 1;
const CONNECT_SUCCESS = 2;
const PACKAGE_WAS_EXIST = -1;
const PACKAGE_NULL = -2;

// CONNECTED
const SERVER_NOT_FOUND = -1;
const SERVER_REFUSED = -2;

// SEND
const SEND_SUCCESS = 0;

export default function App() {
  React.useEffect(() => {
    START_APP.listenEvent('close', (event: any) => {
      START_APP.registerPackageName('com.module_start_app');
      console.log(event);
    });
    START_APP.listenEvent('connect', (event: any) => {
      if (event.code === REGISTER_PACKAGE_SUCCESS) {
        START_APP.connectToServer();
      } else if (event.code === CONNECT_SUCCESS) {
        setInterval(() => {
          START_APP.sendToServer(OPEN_START);
        }, 2000);
      }
      console.log(event);
    });
    START_APP.listenEvent('connected', (event: any) => {
      console.log(event);
    });

    START_APP.listenEvent('error', (event: any) => {
      console.log(event);
    });

    START_APP.listenEvent('send', (event: any) => {
      console.log(event);
    });
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}
    >
      <TouchableOpacity
        style={{
          width: 150,
          height: 50,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          START_APP.connectToServer();
        }}
      >
        <Text style={{ color: 'white' }}>test</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 150,
          height: 50,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          START_APP.registerPackageName('com.module_start_app');
        }}
      >
        <Text style={{ color: 'white' }}>register package</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 150,
          height: 50,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          START_APP.sendToServer(CLOSE_START);
        }}
      >
        <Text style={{ color: 'white' }}>send package</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
