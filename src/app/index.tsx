import { useTimerContext } from "@/context/TimerContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import CircularTimerPicker from "@/components/CircularTimerPicker";
import PrimaryButton from "@/components/PrimaryButton";
import StatCard from "@/components/StatCard";
import TimerPicker from "@/components/TimerPicker";

import { Theme } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const {
    totalSeconds,
    remainingSeconds,
    isRunning,
    focusStats,
    setDuration,
    start,
  } = useTimerContext();

  const isReadyToStart = remainingSeconds === totalSeconds && !isRunning;
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.content}>

        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good Morning</Text>

          <Text style={[styles.title, { color: colors.text }]}>
            LockIn
          </Text>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Commit to your focus session.
          </Text>
        </View>

        <CircularTimerPicker
          totalSeconds={totalSeconds}
          remainingSeconds={remainingSeconds}
        />

        <TimerPicker
          selectedSeconds={totalSeconds}
          disabled={!isReadyToStart}
          onSelect={setDuration}
        />

        <View style={styles.stats}>
          <StatCard
            value={`${Math.floor(focusStats.todaySeconds / 3600)}h ${String(
              Math.floor((focusStats.todaySeconds % 3600) / 60),
            ).padStart(2, "0")}m`}
            label="Today's Focus"
          />

          <StatCard
            value={String(focusStats.currentStreak)}
            label="Current Streak"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View focus history"
          onPress={() => router.push("/history")}
          style={({ pressed }) => [styles.historyLink, pressed && styles.historyLinkPressed]}
        >
          <Text style={[styles.historyLinkText, { color: colors.primary }]}>View focus history</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => router.push("/settings")}
          style={({ pressed }) => [styles.settingsLink, pressed && styles.historyLinkPressed]}
        >
          <Text style={[styles.historyLinkText, { color: colors.textSecondary }]}>Settings</Text>
        </Pressable>

        <PrimaryButton
          title="Start Focus Session"
          disabled={!isReadyToStart}
          onPress={async () => {
              await start();
              router.push("/lock");
          }}
        />

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

    paddingHorizontal: Theme.spacing.md,

    justifyContent: "space-evenly",
  },

  header: {
    gap: Theme.spacing.xs,
  },

  greeting: {

    fontFamily: Theme.fonts.medium,

    fontSize: Theme.typography.body,
  },

  title: {

    fontFamily: Theme.fonts.bold,

    fontSize: Theme.typography.title,
  },

  description: {

    fontFamily: Theme.fonts.regular,

    fontSize: Theme.typography.body,
  },

  stats: {
    flexDirection: "row",

    gap: Theme.spacing.md,
  },

  historyLink: {
    alignItems: "center",
  },

  historyLinkPressed: {
    opacity: 0.7,
  },

  historyLinkText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: Theme.typography.caption,
  },

  settingsLink: {
    alignItems: "center",
    marginTop: -Theme.spacing.sm,
  },
});
