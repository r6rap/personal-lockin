import {
    clearTimer,
    loadTimer,
    saveTimer,
} from "@/services/storageService";
import {
  FocusStats,
  loadFocusStats,
  recordFocusSession,
} from "@/services/focusHistory";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function useTimer(initialSeconds = 3600) {
    const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
    const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isRestoring, setIsRestoring] = useState(true);
    const [focusStats, setFocusStats] = useState<FocusStats>({
      todaySeconds: 0,
      completedSessions: 0,
      currentStreak: 0,
    });

  // Menandakan proses restore sudah selesai
  const restoredRef = useRef(false);
  const completedSessionRef = useRef(false);

  const refreshFocusStats = useCallback(async () => {
    setFocusStats(await loadFocusStats());
  }, []);

  const saveCompletedSession = useCallback(async (
    sessionEndTime: number,
    durationSeconds: number,
  ) => {
    const completedAt = Date.now();

    await recordFocusSession({
      id: `${sessionEndTime}-${durationSeconds}`,
      startedAt: sessionEndTime - durationSeconds * 1000,
      completedAt,
      durationSeconds,
    });

    await refreshFocusStats();
  }, [refreshFocusStats]);

  // Restore saat aplikasi pertama kali dibuat
  useEffect(() => {
    async function restoreTimer() {
      const saved = await loadTimer();

      await refreshFocusStats();

      console.log("RESTORE:", saved);

      if (saved && !saved.isRunning) {
        setTotalSeconds(saved.totalSeconds);
        setRemainingSeconds(saved.totalSeconds);
      } else if (
        saved &&
        saved.isRunning &&
        saved.endTime !== null
      ) {
        const remaining = Math.max(
          0,
          Math.ceil(
            (saved.endTime - Date.now()) / 1000
          )
        );

        if (remaining > 0) {
          setTotalSeconds(saved.totalSeconds);
          setRemainingSeconds(remaining);
          setEndTime(saved.endTime);
          setIsRunning(true);
        } else {
          await clearTimer();
        }
      }

      // Baru setelah restore selesai,
      // save diperbolehkan berjalan.
      restoredRef.current = true;
      setIsRestoring(false);
    }

    restoreTimer();
  }, [refreshFocusStats]);

  // Countdown
  useEffect(() => {
    if (!isRunning || endTime === null) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (!completedSessionRef.current) {
          completedSessionRef.current = true;
          void saveCompletedSession(endTime, totalSeconds);
        }

        setIsRunning(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, endTime, saveCompletedSession, totalSeconds]);

  // Simpan ke storage
  useEffect(() => {
    if (!restoredRef.current) return;

    saveTimer({
      endTime,
      totalSeconds,
      isRunning,
    });

    console.log("SAVE:", {
      endTime,
      totalSeconds,
      isRunning,
    });
  }, [endTime, totalSeconds, isRunning]);

  const progress = useMemo(() => {
    return remainingSeconds / totalSeconds;
  }, [remainingSeconds, totalSeconds]);

  return {
    totalSeconds,
    remainingSeconds,
    endTime,
    progress,
    isRunning,
    isRestoring,
    focusStats,

    setTotalSeconds,
    setRemainingSeconds,

    setDuration: (seconds: number) => {
      if (isRunning || seconds <= 0) return;

      setTotalSeconds(seconds);
      setRemainingSeconds(seconds);
      setEndTime(null);
    },

    start: async () => {
      completedSessionRef.current = false;
      const newEndTime =
        Date.now() + remainingSeconds * 1000;

      setEndTime(newEndTime);
      setIsRunning(true);
    },

    stop: async () => {
      setIsRunning(false);
      setEndTime(null);
      setRemainingSeconds(totalSeconds);
    },

    reset: async () => {
      setRemainingSeconds(totalSeconds);
      setEndTime(null);
      setIsRunning(false);

      await clearTimer();
    },
  };
}
