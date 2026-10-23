import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

import { AppColors, DarkColors, LightColors } from "@/constants/colors";

const THEME_PREFERENCE_KEY = "lockin_theme_preference";

export type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
  colors: AppColors;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    void AsyncStorage.getItem(THEME_PREFERENCE_KEY).then((saved) => {
      if (saved === "system" || saved === "light" || saved === "dark") {
        setPreferenceState(saved);
      }
    });
  }, []);

  const activeScheme = preference === "system" ? systemScheme ?? "dark" : preference;
  const colors = activeScheme === "dark" ? DarkColors : LightColors;

  const value = useMemo(() => ({
    colors,
    preference,
    setPreference: async (nextPreference: ThemePreference) => {
      setPreferenceState(nextPreference);
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, nextPreference);
    },
  }), [colors, preference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used inside ThemeProvider");
  return context;
}
