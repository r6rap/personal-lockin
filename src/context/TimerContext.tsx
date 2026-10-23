import {
    createContext,
    ReactNode,
    useContext,
} from "react";

import useTimer from "@/hooks/useTimer";
import { disableAndroidLockTask, enableAndroidLockTask } from "@/services/lockTask";

const TimerContext = createContext<
  ReturnType<typeof useTimer> | null
>(null);

type Props = {
  children: ReactNode;
};

export function TimerProvider({
  children,
}: Props) {
  const timer = useTimer(25 * 60);

  return (
    <TimerContext.Provider value={{
      ...timer,
      start: async () => {
        timer.start();
        await enableAndroidLockTask();
      },
      stop: async () => {
        timer.stop();
        await disableAndroidLockTask();
      },
      reset: async () => {
        await timer.reset();
        await disableAndroidLockTask();
      },
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error(
      "useTimerContext must be used inside TimerProvider"
    );
  }

  return context;
}
