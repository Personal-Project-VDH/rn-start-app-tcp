package com.rnstartapptcp;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

public class IPV4 {
    public static String getIP(Context context) {
        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifiManager != null && wifiManager.isWifiEnabled()) {
            WifiInfo wifiInfo = wifiManager.getConnectionInfo();
            int ipAddress = wifiInfo.getIpAddress();
            // Địa chỉ IP có thể được biểu diễn dưới dạng dấu chấm thập phân, ví dụ: "192.168.1.100"
            @SuppressLint("DefaultLocale") String ip = String.format("%d.%d.%d.%d",
                    (ipAddress & 0xff),
                    (ipAddress >> 8 & 0xff),
                    (ipAddress >> 16 & 0xff),
                    (ipAddress >> 24 & 0xff));
            return ip;
        } else {
            Log.e("NetworkUtils", "Wifi is not enabled");
            return null;
        }
    }
}
