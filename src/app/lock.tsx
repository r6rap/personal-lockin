import { BackHandler, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFocusEffect } from "expo-router/build/react-navigation";

import { useCallback } from "react";

import { Theme } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";
import { formatTime } from "../utils/time";

import { useTimerContext } from "@/context/TimerContext";

import { router } from "expo-router";
import { useEffect } from "react";

export default function LockScreen() {
  const {
    remainingSeconds,
    endTime,
    stop,
  } = useTimerContext();
  const { colors } = useAppTheme();
  const sessionEnd = endTime ? new Date(endTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "—";

  useFocusEffect(
    useCallback(() => {
      const subscription =
        BackHandler.addEventListener(
          "hardwareBackPress",
          () => true
        );

      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (remainingSeconds === 0) {
      void stop().then(() => router.replace("/complete" as never));
    }
  }, [remainingSeconds, stop]);
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.content}>

        <View style={styles.main}>
          <Text style={styles.lock}>🔒</Text>

          <Text style={[styles.title, { color: colors.text }]}>
            Locked
          </Text>

          <Text style={[styles.timer, { color: colors.text }]}>
            {formatTime(remainingSeconds)}
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Stay committed.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>
            Session ends at
          </Text>

          <Text style={[styles.footerTime, { color: colors.text }]}>
            {sessionEnd}
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,

    justifyContent: "space-between",

    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.xl,
  },

  main: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  lock: {
    fontSize: 72,
  },

  title: {
    marginTop: Theme.spacing.md,


    fontFamily: Theme.fonts.bold,

    fontSize: Theme.typography.heading,
  },

  timer: {
    marginTop: Theme.spacing.lg,


    fontFamily: Theme.fonts.bold,

    fontSize: 56,
  },

  subtitle: {
    marginTop: Theme.spacing.sm,


    fontFamily: Theme.fonts.regular,

    fontSize: Theme.typography.display,
  },

  footer: {
    alignItems: "center",
  },

  footerLabel: {

    fontFamily: Theme.fonts.regular,

    fontSize: Theme.typography.caption,
  },

  footerTime: {
    marginTop: Theme.spacing.xs,


    fontFamily: Theme.fonts.semibold,

    fontSize: Theme.typography.subheading,
  },
});
