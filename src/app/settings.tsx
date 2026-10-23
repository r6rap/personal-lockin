import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Theme } from "@/constants/theme";
import { ThemePreference, useAppTheme } from "@/context/ThemeContext";

const OPTIONS: { value: ThemePreference; label: string; description: string }[] = [
  { value: "system", label: "System", description: "Follow your device appearance" },
  { value: "light", label: "Light", description: "Use a bright workspace" },
  { value: "dark", label: "Dark", description: "Use a low-distraction workspace" },
];

export default function SettingsScreen() {
  const { colors, preference, setPreference } = useAppTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choose the environment that helps you focus.</Text>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>APPEARANCE</Text>
        {OPTIONS.map((option) => {
          const selected = preference === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => void setPreference(option.value)}
              style={[styles.option, { backgroundColor: colors.surface, borderColor: selected ? colors.primary : colors.border }]}
            >
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>{option.label}</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>{option.description}</Text>
              </View>
              <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.border }]}>
                {selected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: Theme.spacing.sm, padding: Theme.spacing.md },
  backButton: { alignSelf: "flex-start", paddingVertical: Theme.spacing.xs },
  backText: { fontFamily: Theme.fonts.semibold, fontSize: Theme.typography.caption },
  title: { fontFamily: Theme.fonts.bold, fontSize: Theme.typography.title },
  subtitle: { fontFamily: Theme.fonts.regular, fontSize: Theme.typography.body },
  sectionLabel: { fontFamily: Theme.fonts.semibold, fontSize: Theme.typography.small, marginTop: Theme.spacing.md },
  option: { alignItems: "center", borderRadius: Theme.radius.md, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", padding: Theme.spacing.md },
  optionTitle: { fontFamily: Theme.fonts.semibold, fontSize: Theme.typography.body },
  optionDescription: { fontFamily: Theme.fonts.regular, fontSize: Theme.typography.caption, marginTop: 4 },
  radio: { alignItems: "center", borderRadius: 12, borderWidth: 2, height: 24, justifyContent: "center", width: 24 },
  radioDot: { borderRadius: 6, height: 12, width: 12 },
});
