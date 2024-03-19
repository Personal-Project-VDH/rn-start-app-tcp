package com.rnstartapptcp;

import androidx.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RnStartAppTcpModule extends ReactContextBaseJavaModule {
  public static final String NAME = "RnStartAppTcp";
  private static ReactContext mReactContext;
  private ClientTCP client_tcp;

  public RnStartAppTcpModule(ReactApplicationContext reactContext) {
    super(reactContext);
    client_tcp = new ClientTCP();
    RnStartAppTcpModule.mReactContext = reactContext;
  }

  public static void sendEvent(String eventName, WritableMap params) {
    RnStartAppTcpModule.mReactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void connectServer() {
    WritableMap params = Arguments.createMap();
    if (client_tcp.name_package.equals("")) {
      params.putString("message", "Pls register package name!");
      params.putInt("code", Contants.PACKAGE_NULL);
      RnStartAppTcpModule.sendEvent("connect", params);
    } else if (client_tcp.isConnected) {
      params.putString("message", "socket was connected");
      params.putInt("code", Contants.WAS_CONNECTED);
      RnStartAppTcpModule.sendEvent("connect", params);
    } else {
      String ip = IPV4.getIP(getReactApplicationContext());
      client_tcp.connectToServer(ip);
    }

  }


  @ReactMethod
  public void registerNamePackage(String name) {
    WritableMap params = Arguments.createMap();
    if (client_tcp.name_package.equals("")) {
      client_tcp.name_package = name;
      params.putString("message", "package name register success!");
      params.putInt("code", Contants.REGISTER_PACKAGE_SUCCESS);
      RnStartAppTcpModule.sendEvent("connect", params);
    } else {
      params.putString("message", "package name was register!");
      params.putInt("code", Contants.PACKAGE_WAS_EXIST);
      RnStartAppTcpModule.sendEvent("connect", params);
    }

  }

  @ReactMethod
  public void sendToServer(int stt) {
    client_tcp.sendToServer(stt);
  }
}
