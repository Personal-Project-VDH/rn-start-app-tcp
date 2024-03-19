package com.rnstartapptcp;
import android.util.Log;

import com.facebook.react.bridge.Arguments;

import com.facebook.react.bridge.WritableMap;


import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

import java.net.UnknownHostException;

public class ClientTCP {

    private final String TAG = Contants.TAG;
    public String name_package = "";
    public Socket socket = null;
    public boolean isConnected = false;
    private InputStream inputStream = null;
    private OutputStream outputStream = null;

    private void sendMessageToReact(String message, String eventName, int code) {
        new Thread() {
            @Override
            public void run() {
                WritableMap params = Arguments.createMap();
                params.putString("message", message);
                params.putInt("code", code);
                RnStartAppTcpModule.sendEvent(eventName, params);

            }
        }.start();
    }


    public void sendToServer(int stt) {
        new Thread() {
            @Override
            public void run() {

                try {
                    if (ClientTCP.this.socket == null) {
                        ClientTCP.this.sendMessageToReact("Socket is null", "error", Contants.SOCKET_NULL);
                        return;
                    }
                    outputStream = ClientTCP.this.socket.getOutputStream();
                    JSONObject obj = new JSONObject();
                    obj.put("CMD", "PO");
                    obj.put("NAME", ClientTCP.this.name_package);
                    obj.put("STATUS", stt);
                    outputStream.write((byte) 0x7F);
                    outputStream.write(obj.toString().getBytes());
                    outputStream.write((byte) 0x7E);
                    outputStream.flush();
                    ClientTCP.this.sendMessageToReact("Send : " + obj.toString(), "send", Contants.SEND_SUCCESS);
                } catch (IOException e) {
                    Log.d(TAG, "IOException: " + e.getMessage());
                    ClientTCP.this.sendMessageToReact(e.getMessage(), "error", Contants.SOCKET_CLOSE);
                } catch (JSONException e) {
                    Log.d(TAG, "JSONException: " + e.getMessage());
                }

            }
        }.start();
    }


    public void closeSocket() throws IOException {
        if (this.socket != null) {
            this.socket.close();
            this.inputStream.close();
            ClientTCP.this.name_package = "";
            this.isConnected = false;
            ClientTCP.this.sendMessageToReact("socket close!", "close", Contants.SOCKET_CLOSE);
        }
    }

    private void onData() {
        Thread data_thread = new Thread() {
            @Override
            public void run() {
                int ch = 0;
                try {

                    inputStream = ClientTCP.this.socket.getInputStream();
                    StringBuilder sb = new StringBuilder();
                    byte[] buffer = new byte[1024];

                    while (ch != -1) {

                        ch = inputStream.read(); // Receive data from server
                        if (ch == (byte) 0x7F) {
                            sb.delete(0, sb.length());
                        } else if (ch == (byte) 0x7E) {
                            String result = sb.toString();

                        } else {
                            sb.append((char) (ch & 0xFF));
                        }

                    }
                    ClientTCP.this.closeSocket();

                } catch (IOException e) {
                    Log.d(TAG, "onData: " + e.getMessage());
                } catch (NullPointerException e) {
                    Log.d(TAG, "onData: socket close" + e.getMessage());
                }

            }
        };
        data_thread.setPriority(Thread.MAX_PRIORITY);
        data_thread.start();

    }

    public void connectToServer(String ip) {
        if (ip != null) {
            try {
                this.socket = new Socket(ip, Contants.PORT);
                ClientTCP.this.sendMessageToReact("connect success!", "connect", Contants.CONNECT_SUCCESS);
                this.isConnected = true;
                this.onData();
            } catch (UnknownHostException ex) {
                Log.d(TAG, "Server not found: " + ex.getMessage());
                ClientTCP.this.sendMessageToReact("server not found!", "connected", Contants.SERVER_NOT_FOUND);
            } catch (IOException ex) {
                Log.d(TAG, "IO err " + ex.getMessage());
                this.isConnected = false;
                ClientTCP.this.sendMessageToReact("server refused!", "connected", Contants.SERVER_REFUSED);
            }
        } else {
            Log.d(TAG, "IP Null ");
        }
    }


}
