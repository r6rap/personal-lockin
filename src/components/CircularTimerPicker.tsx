import Svg, { Circle } from "react-native-svg";

import { StyleSheet, Text, View } from "react-native";

import { useEffect } from "react";

import { useAppTheme } from "@/context/ThemeContext";
import { Theme } from "@/constants/theme";
import { formatTime } from "@/utils/time";

import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedCircle =
  Animated.createAnimatedComponent(Circle);

type Props = {
    totalSeconds: number;
    remainingSeconds: number;
};

const SIZE = 280;
const STROKE = 12;

const RADIUS = (SIZE - STROKE) / 2;

const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CircularTimerPicker({
    totalSeconds,
    remainingSeconds,
}: Props) {
  const { colors } = useAppTheme();
  const progress = remainingSeconds / totalSeconds;
  const duration = formatTime(remainingSeconds);
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 300,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      CIRCUMFERENCE * (1 - animatedProgress.value),
  }));
  return (
    <View style={styles.container}>
      <Svg
        width={SIZE}
        height={SIZE}
      >
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.border}
          strokeWidth={STROKE}
          fill="none"
        />

        <AnimatedCircle
            animatedProps={animatedProps}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.primary}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            transform={[
                { translateX: SIZE / 2 },
                { translateY: SIZE / 2 },
                { rotate: "-90deg" },
                { translateX: -SIZE / 2 },
                { translateY: -SIZE / 2 },
            ]}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={[styles.time, { color: colors.text }]}>
          {duration}
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Focus Duration
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,

    alignItems: "center",
    justifyContent: "center",

    alignSelf: "center",
  },

  center: {
    position: "absolute",

    alignItems: "center",
  },

  time: {

    fontFamily: Theme.fonts.bold,

    fontSize: Theme.typography.hero,
  },

  subtitle: {
    marginTop: Theme.spacing.xs,


    fontFamily: Theme.fonts.regular,

    fontSize: Theme.typography.body,
  },
});
