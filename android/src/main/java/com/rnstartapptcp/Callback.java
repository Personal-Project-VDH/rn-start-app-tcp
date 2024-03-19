package com.rnstartapptcp;
import android.util.Log;

import org.json.JSONException;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Callback {
    private final static String TAG = Contants.TAG;
    public static Map<String, CallBackMethod> callback_map = new HashMap<>();

    public static void runCallback(String key, Object value) {
        try {
            Log.d(TAG, "runCallback: " + key + " " + value);
            Objects.requireNonNull(callback_map.get(key)).invoke(value);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void assignCallback(CallBackMethod... callbacks) {
        for (CallBackMethod callback : callbacks) {
            callback_map.put(callback.getKey(), callback);
        }
    }

    public static void clearCallback() {
        callback_map.clear();
    }

    public interface CallBackMethod {
        void invoke(Object value);

        String getKey();
    }
}
