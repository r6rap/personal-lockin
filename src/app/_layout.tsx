import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TimerProvider } from "@/context/TimerContext";
import { ThemeProvider } from "@/context/ThemeContext";

import StartupGate from "@/components/StartupGate";

import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TimerProvider>
          <StartupGate />
          <Stack screenOptions={{ headerShown: false }} />
        </TimerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
