import AsyncStorage from "@react-native-async-storage/async-storage";

const FOCUS_HISTORY_KEY = "lockin_focus_history";
const MAX_SAVED_SESSIONS = 365;

export type FocusSession = {
  id: string;
  startedAt: number;
  completedAt: number;
  durationSeconds: number;
};

export type FocusStats = {
  todaySeconds: number;
  completedSessions: number;
  currentStreak: number;
};

const emptyStats: FocusStats = {
  todaySeconds: 0,
  completedSessions: 0,
  currentStreak: 0,
};

function startOfLocalDay(timestamp: number) {
  const day = new Date(timestamp);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
}

function isFocusSession(value: unknown): value is FocusSession {
  if (!value || typeof value !== "object") return false;

  const session = value as FocusSession;
  return (
    typeof session.id === "string" &&
    typeof session.startedAt === "number" &&
    typeof session.completedAt === "number" &&
    typeof session.durationSeconds === "number"
  );
}

export async function loadFocusHistory(): Promise<FocusSession[]> {
  const raw = await AsyncStorage.getItem(FOCUS_HISTORY_KEY);

  if (!raw) return [];

  try {
    const history: unknown = JSON.parse(raw);
    if (!Array.isArray(history)) return [];

    return history
      .filter(isFocusSession)
      .sort((a, b) => b.completedAt - a.completedAt);
  } catch {
    return [];
  }
}

export async function recordFocusSession(
  session: FocusSession,
): Promise<FocusSession[]> {
  const history = await loadFocusHistory();
  const nextHistory = [session, ...history]
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, MAX_SAVED_SESSIONS);

  await AsyncStorage.setItem(FOCUS_HISTORY_KEY, JSON.stringify(nextHistory));
  return nextHistory;
}

export function calculateFocusStats(
  history: FocusSession[],
  now = Date.now(),
): FocusStats {
  if (history.length === 0) return emptyStats;

  const today = startOfLocalDay(now);
  const dayWithFocus = new Set(history.map((session) => startOfLocalDay(session.completedAt)));
  const todaySeconds = history
    .filter((session) => startOfLocalDay(session.completedAt) === today)
    .reduce((total, session) => total + session.durationSeconds, 0);

  let currentStreak = 0;
  let day = today;

  if (!dayWithFocus.has(day)) {
    day -= 24 * 60 * 60 * 1000;
  }

  while (dayWithFocus.has(day)) {
    currentStreak += 1;
    day -= 24 * 60 * 60 * 1000;
  }

  return {
    todaySeconds,
    completedSessions: history.length,
    currentStreak,
  };
}

export async function loadFocusStats(): Promise<FocusStats> {
  return calculateFocusStats(await loadFocusHistory());
}
