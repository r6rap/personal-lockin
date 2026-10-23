import AsyncStorage from "@react-native-async-storage/async-storage";

const TIMER_KEY = "lockin_timer";

export async function saveTimer(data: {
  endTime: number | null;
  totalSeconds: number;
  isRunning: boolean;
}) {
  await AsyncStorage.setItem(
    TIMER_KEY,
    JSON.stringify(data)
  );
}

export async function loadTimer() {
  const raw = await AsyncStorage.getItem(TIMER_KEY);

  if (!raw) return null;

  return JSON.parse(raw);
}

export async function clearTimer() {
  await AsyncStorage.removeItem(TIMER_KEY);
}