import {
  NativeModules,
  Platform,
  DeviceEventEmitter,
  BackHandler,
  AppState,
} from 'react-native';

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

var interval_send: any;
var timeout_connect: any;

class CLIENT {
  #name_package: string;
  constructor() {
    this.#name_package = '';
  }

  #connectToServer() {
    RnStartAppTcp.connectServer();
  }

  registerPackageName(name: string) {
    RnStartAppTcp.registerNamePackage(name);
    this.#name_package = name;
  }

  #sendToServer(status: number) {
    RnStartAppTcp.sendToServer(status);
  }

  quitApp() {
    clearTimeout(timeout_connect);
    clearInterval(interval_send);

    RnStartAppTcp.sendToServer(CONSTANTS.QUIT_APP);

    setTimeout(() => {
      BackHandler.exitApp();
    }, 1000);
  }

  #listenEvent(event_name: string, callback: any) {
    DeviceEventEmitter.addListener(event_name, callback);
  }

  #sendToKeepConnect() {
    clearTimeout(timeout_connect);
    clearInterval(interval_send);
    this.#sendToServer(CONSTANTS.OPEN_START);
    interval_send = setInterval(() => {
      this.#sendToServer(CONSTANTS.OPEN_START);
    }, 2000);
  }

  #reconnectFunction() {
    timeout_connect = setTimeout(() => {
      this.#connectToServer();
    }, 2000);
  }

  sideEffectListener() {
    this.#listenEvent('close', (event: any) => {
      this.registerPackageName(this.#name_package);
      console.log(event, ' close');
    });
    this.#listenEvent('connect', (event: any) => {
      if (event.code === CONSTANTS.REGISTER_PACKAGE_SUCCESS) {
        this.#connectToServer();
      } else if (event.code === CONSTANTS.CONNECT_SUCCESS) {
        this.#sendToKeepConnect();
      }
      console.log(event, 'connect');
    });
    this.#listenEvent('connected', (event: any) => {
      console.log(event, 'connected');
      if (event.code === CONSTANTS.SERVER_REFUSED) {
        this.#reconnectFunction();
      }
    });

    this.#listenEvent('error', (event: any) => {
      console.log(event, 'error');
    });
  }

  getAppState(appState: any, callback: any) {
    AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        callback();
      }

      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });
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
