import { useEffect } from "react";
import { router, usePathname } from "expo-router";
import { useTimerContext } from "@/context/TimerContext";

export default function StartupGate() {
  const {
    isRestoring,
    isRunning,
    remainingSeconds,
  } = useTimerContext();

  const pathname = usePathname();

  useEffect(() => {
    if (isRestoring) return;

    if (
      isRunning &&
      remainingSeconds > 0 &&
      pathname !== "/lock"
    ) {
      router.replace("/lock");
    }
  }, [isRestoring]);

  return null;
}