import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/colors";
import { Theme } from "@/constants/theme";

type TimerCardProps = {
  duration: string;
  subtitle?: string;
};

export default function TimerCard({
  duration,
  subtitle = "Ready to focus",
}: TimerCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.time}>{duration}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,

    borderRadius: Theme.radius.xl,

    paddingVertical: 42,

    alignItems: "center",

    borderWidth: 1,
    borderColor: Colors.border,

    ...Theme.shadows.card
  },

  time: {
    color: Colors.text,

    fontFamily: Theme.fonts.bold,

    fontSize: Theme.typography.hero,
  },

  subtitle: {
    marginTop: Theme.spacing.sm,

    color: Colors.textSecondary,

    fontFamily: Theme.fonts.regular,

    fontSize: Theme.typography.body,
  },
});