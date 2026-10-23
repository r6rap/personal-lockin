import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/context/ThemeContext";
import { Theme } from "@/constants/theme";

type StatCardProps = {
  label: string;
  value: string;
};

export default function StatCard({
  label,
  value,
}: StatCardProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,


    borderRadius: Theme.radius.lg,

    borderWidth: 1,

    paddingVertical: Theme.spacing.md,

    alignItems: "center",

    ...Theme.shadows.card,
  },

  value: {
    fontFamily: Theme.fonts.bold,
    fontSize: Theme.typography.heading,
  },

  label: {
    marginTop: Theme.spacing.xs,

    fontFamily: Theme.fonts.regular,
    fontSize: Theme.typography.caption,
  },
});
