import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { HomeServiceCategory } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { AmbientBackground } from "../components/AmbientBackground";
import { GlassCard } from "../components/GlassCard";
import { PressableScale } from "../components/PressableScale";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand, gradients } from "../theme";
import { apiRequest } from "../api/client";

const CATEGORIES: { key: HomeServiceCategory; label: string; emoji: string }[] = [
  { key: "electrician", label: "Electrician", emoji: "⚡" },
  { key: "plumber", label: "Plumber", emoji: "🔧" },
  { key: "ac_technician", label: "AC Technician", emoji: "❄️" },
  { key: "cleaning", label: "Cleaning", emoji: "🧹" },
  { key: "appliance_repair", label: "Appliance Repair", emoji: "🛠️" },
];

export function NexHomeScreen() {
  const { colors, spacing, radius, type, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<HomeServiceCategory | null>(null);
  const [description, setDescription] = useState("");
  const [confirmed, setConfirmed] = useState<{ technicianName?: string; priceEstimate: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function book() {
    if (!category) return;
    setLoading(true);
    try {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const res = await apiRequest<{ request: { technicianName?: string; priceEstimate: number } }>("/home/requests", {
        method: "POST",
        body: { category, description: description || "General visit", scheduledFor: tomorrow },
      });
      setConfirmed(res.request);
    } finally {
      setLoading(false);
    }
  }

  if (confirmed) {
    return (
      <Screen>
        <Text style={[type.title, { color: colors.textPrimary }]}>Visit scheduled 🏠</Text>
        <GlassCard gradientBorder={gradients.home}>
          <Text style={[type.body, { color: colors.textSecondary }]}>{confirmed.technicianName ?? "A technician"} will visit tomorrow</Text>
          <Text style={[type.title, { color: colors.textPrimary, marginTop: 4 }]}>Estimated ₹{confirmed.priceEstimate}</Text>
        </GlassCard>
        <PrimaryButton label="Book another" onPress={() => { setConfirmed(null); setCategory(null); setDescription(""); }} />
      </Screen>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: category ? 140 : spacing.lg }} showsVerticalScrollIndicator={false}>
        <Text style={[type.micro, { color: brand.home }]}>NEXHOME</Text>
        <Text style={[type.title, { color: colors.textPrimary }]}>What do you need?</Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
          {CATEGORIES.map((c) => {
            const isSelected = category === c.key;
            return (
              <PressableScale key={c.key} style={styles.tile} onPress={() => setCategory(c.key)} scaleTo={0.95}>
                <GlassCard padding={spacing.md} accentColor={isSelected ? brand.home : undefined}>
                  <LinearGradient
                    colors={gradients.home}
                    start={{ x: 0.15, y: 0.1 }}
                    end={{ x: 0.9, y: 1 }}
                    style={[styles.iconWrap, { borderRadius: radius.md }]}
                  >
                    <Text style={{ fontSize: 20 }}>{c.emoji}</Text>
                  </LinearGradient>
                  <Text style={[type.caption, { color: colors.textPrimary, marginTop: spacing.sm, fontWeight: "700" }]}>{c.label}</Text>
                </GlassCard>
              </PressableScale>
            );
          })}
        </View>

        <GlassCard>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Briefly describe the issue (optional)"
            placeholderTextColor={colors.textMuted}
            multiline
            style={{ color: colors.textPrimary, minHeight: 70, textAlignVertical: "top" }}
          />
        </GlassCard>
      </ScrollView>

      {category && (
        <View style={styles.stickyWrap}>
          <BlurView intensity={isDark ? 55 : 75} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          <View style={[styles.stickyBar, { padding: spacing.lg, paddingBottom: spacing.lg + insets.bottom, borderTopColor: colors.glassBorder }]}>
            <View style={{ flex: 1 }}>
              <Text style={[type.caption, { color: colors.textMuted }]}>Selected</Text>
              <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{CATEGORIES.find((c) => c.key === category)?.label}</Text>
            </View>
            <View style={{ width: 180 }}>
              <PrimaryButton label={loading ? "Scheduling..." : "Schedule for tomorrow"} onPress={book} loading={loading} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tile: { minWidth: "45%", flexGrow: 1 },
  iconWrap: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  stickyWrap: { position: "absolute", left: 0, right: 0, bottom: 0, overflow: "hidden" },
  stickyBar: { flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1 },
});
