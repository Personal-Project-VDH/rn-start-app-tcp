import { NativeModules, Platform, DeviceEventEmitter } from 'react-native';

const LINKING_ERROR =
  `The package 'rn-start-app-tcp' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RnStartAppTcp = NativeModules.RnStartAppTcp
  ? NativeModules.RnStartAppTcp
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

class CLIENT {
  constructor() {}

  connectToServer() {
    RnStartAppTcp.connectServer();
  }

  registerPackageName(name: string) {
    RnStartAppTcp.registerNamePackage(name);
  }

  sendToServer(status: number) {
    RnStartAppTcp.sendToServer(status);
  }

  listenEvent(event_name: string, callback: any) {
    DeviceEventEmitter.addListener(event_name, callback);
  }
}

export const START_APP = new CLIENT();
export const CONSTANTS = {
  OPEN_START: 0,
  CLOSE_START: -1,
  QUIT_APP: -2,
  SOCKET_CLOSE: -1,
  SOCKET_NULL: -2,
  WAS_CONNECTED: 0,
  REGISTER_PACKAGE_SUCCESS: 1,
  CONNECT_SUCCESS: 2,
  PACKAGE_WAS_EXIST: -1,
  PACKAGE_NULL: -2,
  SERVER_NOT_FOUND: -1,
  SERVER_REFUSED: -2,
  SEND_SUCCESS: 0,
};
