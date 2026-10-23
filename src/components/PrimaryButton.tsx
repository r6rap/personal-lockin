import { Pressable, StyleSheet, Text } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import { Theme } from "@/constants/theme";

type PrimaryButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        [styles.button, { backgroundColor: colors.primary }],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.text, { color: "#FFFFFF" }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    fontSize: Theme.typography.body,
    fontFamily: "Inter_700Bold",
  },
});
