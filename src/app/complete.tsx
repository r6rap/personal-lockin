import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Theme } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";
import { useTimerContext } from "@/context/TimerContext";

export default function CompleteScreen() {
  const { colors } = useAppTheme();
  const { totalSeconds } = useTimerContext();
  const minutes = Math.round(totalSeconds / 60);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.celebration}>✓</Text>
        <Text style={[styles.title, { color: colors.text }]}>Session complete</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>You protected {minutes} minutes for what matters. Your consistency is growing.</Text>
        <Pressable onPress={() => router.replace("/")} style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={styles.buttonText}>Back to home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { alignItems: "center", flex: 1, justifyContent: "center", padding: Theme.spacing.lg },
  celebration: { color: "#FFFFFF", fontFamily: Theme.fonts.bold, fontSize: 44, marginBottom: Theme.spacing.md, textAlign: "center" },
  title: { fontFamily: Theme.fonts.bold, fontSize: Theme.typography.title, textAlign: "center" },
  message: { fontFamily: Theme.fonts.regular, fontSize: Theme.typography.body, lineHeight: 24, marginTop: Theme.spacing.sm, textAlign: "center" },
  button: { alignSelf: "stretch", alignItems: "center", borderRadius: Theme.radius.lg, marginTop: Theme.spacing.xl, paddingVertical: 18 },
  buttonText: { color: "#FFFFFF", fontFamily: Theme.fonts.bold, fontSize: Theme.typography.body },
});
