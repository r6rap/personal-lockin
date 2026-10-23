package com.lockinapp;

import android.app.Activity;
import android.os.Build;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LockTaskModule extends ReactContextBaseJavaModule {
  LockTaskModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "LockTaskModule";
  }

  @ReactMethod
  public void enableLockTask(Promise promise) {
    Activity activity = getCurrentActivity();

    if (activity == null) {
      promise.reject("E_ACTIVITY", "No current activity available");
      return;
    }

    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        activity.setShowWhenLocked(true);
        activity.setTurnScreenOn(true);
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        activity.startLockTask();
      }

      promise.resolve(true);
    } catch (Throwable error) {
      promise.reject("E_LOCK_TASK", error.getMessage(), error);
    }
  }

  @ReactMethod
  public void disableLockTask(Promise promise) {
    Activity activity = getCurrentActivity();

    if (activity == null) {
      promise.reject("E_ACTIVITY", "No current activity available");
      return;
    }

    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        activity.stopLockTask();
      }

      promise.resolve(true);
    } catch (Throwable error) {
      promise.reject("E_LOCK_TASK", error.getMessage(), error);
    }
  }
}
