import { NativeModules, Platform } from "react-native";

const { LockTaskModule } = NativeModules as {
  LockTaskModule?: {
    enableLockTask?: () => Promise<boolean>;
    disableLockTask?: () => Promise<boolean>;
  };
};

export async function enableAndroidLockTask() {
  if (Platform.OS !== "android") {
    return false;
  }

  if (!LockTaskModule?.enableLockTask) {
    console.warn("Android lock task module is unavailable.");
    return false;
  }

  try {
    return await LockTaskModule.enableLockTask();
  } catch (error) {
    console.warn("Unable to enable Android lock task:", error);
    return false;
  }
}

export async function disableAndroidLockTask() {
  if (Platform.OS !== "android") {
    return false;
  }

  if (!LockTaskModule?.disableLockTask) {
    console.warn("Android lock task module is unavailable.");
    return false;
  }

  try {
    return await LockTaskModule.disableLockTask();
  } catch (error) {
    console.warn("Unable to disable Android lock task:", error);
    return false;
  }
}
