import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { HomeServiceCategory } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

const CATEGORIES: { key: HomeServiceCategory; label: string; emoji: string }[] = [
  { key: "electrician", label: "Electrician", emoji: "⚡" },
  { key: "plumber", label: "Plumber", emoji: "🔧" },
  { key: "ac_technician", label: "AC Technician", emoji: "❄️" },
  { key: "cleaning", label: "Cleaning", emoji: "🧹" },
  { key: "appliance_repair", label: "Appliance Repair", emoji: "🛠️" },
];

export function NexHomeScreen() {
  const { colors, spacing, radius, type } = useTheme();
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
        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
          <Text style={[type.body, { color: colors.textSecondary }]}>{confirmed.technicianName ?? "A technician"} will visit tomorrow</Text>
          <Text style={[type.subtitle, { color: colors.textPrimary }]}>Estimated ₹{confirmed.priceEstimate}</Text>
        </View>
        <PrimaryButton label="Book another" onPress={() => { setConfirmed(null); setCategory(null); setDescription(""); }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={[type.micro, { color: brand.home }]}>NEXHOME</Text>
      <Text style={[type.title, { color: colors.textPrimary }]}>What do you need?</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {CATEGORIES.map((c) => {
          const isSelected = category === c.key;
          return (
            <Pressable
              key={c.key}
              onPress={() => setCategory(c.key)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: radius.pill,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? brand.home : colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Text style={[type.caption, { color: colors.textPrimary }]}>{c.emoji} {c.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Briefly describe the issue (optional)"
        placeholderTextColor={colors.textMuted}
        multiline
        style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, color: colors.textPrimary, minHeight: 90, textAlignVertical: "top" }}
      />

      <PrimaryButton label={loading ? "Scheduling..." : "Schedule for tomorrow"} onPress={book} disabled={!category} loading={loading} />
    </Screen>
  );
}
