import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";
import { Theme } from "@/constants/theme";

const DURATIONS_IN_MINUTES = [15, 25, 45, 60, 90];

type TimerPickerProps = {
  selectedSeconds: number;
  disabled?: boolean;
  onSelect: (seconds: number) => void;
};

export default function TimerPicker({
  selectedSeconds,
  disabled = false,
  onSelect,
}: TimerPickerProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Focus duration</Text>

      <View style={styles.options}>
        {DURATIONS_IN_MINUTES.map((minutes) => {
          const seconds = minutes * 60;
          const isSelected = selectedSeconds === seconds;

          return (
            <Pressable
              key={minutes}
              accessibilityRole="button"
              accessibilityLabel={`Set focus duration to ${minutes} minutes`}
              accessibilityState={{ disabled, selected: isSelected }}
              disabled={disabled}
              onPress={() => onSelect(seconds)}
              style={({ pressed }) => [
                [styles.option, { backgroundColor: colors.surface, borderColor: colors.border }],
                isSelected && [styles.optionSelected, { backgroundColor: colors.primary, borderColor: colors.primary }],
                disabled && styles.optionDisabled,
                pressed && !disabled && [styles.optionPressed, { backgroundColor: colors.surfaceLight }],
              ]}
            >
              <Text style={[styles.optionText, { color: colors.text }, isSelected && styles.optionTextSelected]}>
                {minutes}m
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.helper, { color: colors.textSecondary }]}>
        Choose how long LockIn keeps you focused.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.xs,
  },
  label: {
    fontFamily: Theme.fonts.medium,
    fontSize: Theme.typography.caption,
    textAlign: "center",
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.xs,
    justifyContent: "center",
  },
  option: {
    alignItems: "center",
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    minWidth: 54,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 12,
  },
  optionSelected: {
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionPressed: {
  },
  optionText: {
    fontFamily: Theme.fonts.semibold,
    fontSize: Theme.typography.body,
  },
  optionTextSelected: {
  },
  helper: {
    fontFamily: Theme.fonts.regular,
    fontSize: Theme.typography.small,
    textAlign: "center",
  },
});
