import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import { Theme } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";
import { FocusSession, loadFocusHistory } from "@/services/focusHistory";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayStart(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export default function HistoryScreen() {
  const { colors } = useAppTheme();
  const [history, setHistory] = useState<FocusSession[]>([]);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(dayStart(Date.now()));

  useFocusEffect(useCallback(() => {
    void loadFocusHistory().then(setHistory);
  }, []));

  const sessionsByDay = useMemo(() => history.reduce<Record<number, FocusSession[]>>((days, session) => {
    const key = dayStart(session.completedAt);
    (days[key] ??= []).push(session);
    return days;
  }, {}), [history]);
  const selectedSessions = sessionsByDay[selectedDay] ?? [];
  const selectedMinutes = selectedSessions.reduce((total, session) => total + session.durationSeconds, 0) / 60;
  const days = useMemo(() => {
    const offset = month.getDay();
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return Array.from({ length: offset + count }, (_, index) => index < offset ? null : new Date(month.getFullYear(), month.getMonth(), index - offset + 1));
  }, [month]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Focus History</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Consistency is built one completed session at a time.</Text>

        <View style={styles.monthHeader}>
          <Pressable onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} style={styles.monthButton}>
            <Text style={[styles.monthButtonText, { color: colors.primary }]}>‹</Text>
          </Pressable>
          <Text style={[styles.monthTitle, { color: colors.text }]}>{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</Text>
          <Pressable onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} style={styles.monthButton}>
            <Text style={[styles.monthButtonText, { color: colors.primary }]}>›</Text>
          </Pressable>
        </View>

        <View style={styles.weekdays}>
          {WEEKDAYS.map((weekday) => <Text key={weekday} style={[styles.weekday, { color: colors.textSecondary }]}>{weekday}</Text>)}
        </View>
        <View style={styles.calendar}>
          {days.map((date, index) => {
            if (!date) return <View key={`empty-${index}`} style={styles.dayCell} />;
            const timestamp = dayStart(date.getTime());
            const hasFocus = Boolean(sessionsByDay[timestamp]?.length);
            const isSelected = timestamp === selectedDay;
            return (
              <Pressable key={timestamp} onPress={() => setSelectedDay(timestamp)} style={styles.dayCell}>
                <View style={[styles.day, isSelected && { backgroundColor: colors.primary }, !isSelected && hasFocus && { borderColor: colors.primary, borderWidth: 1 }]}>
                  <Text style={[styles.dayText, { color: isSelected ? "#FFFFFF" : colors.text }]}>{date.getDate()}</Text>
                </View>
                {hasFocus && !isSelected && <View style={[styles.focusDot, { backgroundColor: colors.primary }]} />}
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>{new Date(selectedDay).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>{selectedSessions.length ? `${selectedSessions.length} session · ${Math.round(selectedMinutes)} min` : "No completed focus session"}</Text>
        </View>

        {selectedSessions.map((session) => (
          <View key={session.id} style={[styles.session, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sessionDuration, { color: colors.text }]}>{Math.round(session.durationSeconds / 60)} min</Text>
            <Text style={[styles.sessionTime, { color: colors.success }]}>{new Date(session.completedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} completed</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: Theme.spacing.sm, padding: Theme.spacing.md, paddingBottom: Theme.spacing.xl },
  backButton: { alignSelf: "flex-start", paddingVertical: Theme.spacing.xs },
  backText: { fontFamily: Theme.fonts.semibold, fontSize: Theme.typography.caption },
  title: { fontFamily: Theme.fonts.bold, fontSize: Theme.typography.title },
  subtitle: { fontFamily: Theme.fonts.regular, fontSize: Theme.typography.body },
  monthHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: Theme.spacing.sm },
  monthButton: { alignItems: "center", justifyContent: "center", minHeight: 40, minWidth: 40 },
  monthButtonText: { fontFamily: Theme.fonts.bold, fontSize: 30 },
  monthTitle: { fontFamily: Theme.fonts.semibold, fontSize: Theme.typography.subheading },
  weekdays: { flexDirection: "row", marginTop: Theme.spacing.xs },
  weekday: { flex: 1, fontFamily: Theme.fonts.medium, fontSize: Theme.typography.small, textAlign: "center" },
  calendar: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { alignItems: "center", height: 48, justifyContent: "center", width: "14.2857%" },
  day: { alignItems: "center", borderRadius: 18, height: 36, justifyContent: "center", width: 36 },
  dayText: { fontFamily: Theme.fonts.medium, fontSize: Theme.typography.caption },
  focusDot: { borderRadius: 3, height: 5, marginTop: 2, width: 5 },
  summary: { borderRadius: Theme.radius.md, borderWidth: 1, gap: 4, marginTop: Theme.spacing.sm, padding: Theme.spacing.md },
  summaryTitle: { fontFamily: Theme.fonts.semibold, fontSize: Theme.typography.body },
  summaryValue: { fontFamily: Theme.fonts.regular, fontSize: Theme.typography.caption },
  session: { alignItems: "center", borderRadius: Theme.radius.md, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", padding: Theme.spacing.md },
  sessionDuration: { fontFamily: Theme.fonts.semibold, fontSize: Theme.typography.body },
  sessionTime: { fontFamily: Theme.fonts.medium, fontSize: Theme.typography.caption },
});
