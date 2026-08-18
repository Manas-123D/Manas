import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { RideOption, RideVehicleType } from "@nexserv/shared";
import { AmbientBackground } from "../components/AmbientBackground";
import { GlassCard } from "../components/GlassCard";
import { PressableScale } from "../components/PressableScale";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand, gradients } from "../theme";
import { apiRequest } from "../api/client";

// Demo route: home -> work, from the seeded Hyderabad demo account.
const PICKUP = { lat: 17.4401, lng: 78.3489, label: "Home" };
const DROPOFF = { lat: 17.4483, lng: 78.3915, label: "Work" };

const VEHICLE_LABEL: Record<RideVehicleType, string> = { bike: "Bike", auto: "Auto", cab: "Cab", pool: "Pool" };
const VEHICLE_EMOJI: Record<RideVehicleType, string> = { bike: "🏍️", auto: "🛺", cab: "🚗", pool: "👥" };

export function NexRideScreen() {
  const { colors, spacing, radius, type, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [options, setOptions] = useState<RideOption[]>([]);
  const [selected, setSelected] = useState<RideVehicleType | null>(null);
  const [loading, setLoading] = useState(false);

  async function getQuotes() {
    setLoading(true);
    try {
      const res = await apiRequest<{ options: RideOption[] }>("/rides/quote", { method: "POST", body: { pickup: PICKUP, dropoff: DROPOFF } });
      setOptions(res.options);
    } finally {
      setLoading(false);
    }
  }

  async function book() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await apiRequest<{ ride: { id: string } }>("/rides", {
        method: "POST",
        body: { pickup: PICKUP, dropoff: DROPOFF, vehicleType: selected },
      });
      navigation.replace("Tracking", { kind: "ride", id: res.ride.id });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getQuotes();
  }, []);

  const selectedOption = options.find((o) => o.vehicleType === selected);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: selectedOption ? 140 : spacing.lg }} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={[type.micro, { color: brand.ride }]}>NEXRIDE</Text>
          <Text style={[type.title, { color: colors.textPrimary }]}>{PICKUP.label} → {DROPOFF.label}</Text>
        </View>

        <View style={{ gap: spacing.md }}>
          {options.map((o) => {
            const isSelected = selected === o.vehicleType;
            return (
              <PressableScale key={o.vehicleType} onPress={() => setSelected(o.vehicleType)} scaleTo={0.98}>
                <GlassCard accentColor={isSelected ? brand.ride : undefined}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <LinearGradient
                        colors={gradients.ride}
                        start={{ x: 0.15, y: 0.1 }}
                        end={{ x: 0.9, y: 1 }}
                        style={[styles.iconWrap, { borderRadius: radius.md }]}
                      >
                        <Text style={{ fontSize: 22 }}>{VEHICLE_EMOJI[o.vehicleType]}</Text>
                      </LinearGradient>
                      <View>
                        <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{VEHICLE_LABEL[o.vehicleType]}</Text>
                        <Text style={[type.caption, { color: colors.textMuted }]}>{o.etaMinutes} min away</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: "flex-end", gap: 4 }}>
                      <Text style={[type.subtitle, { color: colors.textPrimary }]}>₹{o.priceEstimate}</Text>
                      {o.surge > 1 && (
                        <View style={{ backgroundColor: colors.warning + "22", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
                          <Text style={[type.micro, { color: colors.warning }]}>SURGE</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </GlassCard>
              </PressableScale>
            );
          })}
        </View>
      </ScrollView>

      {selectedOption && (
        <View style={styles.stickyWrap}>
          <BlurView intensity={isDark ? 55 : 75} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          <View style={[styles.stickyBar, { padding: spacing.lg, paddingBottom: spacing.lg + insets.bottom, borderTopColor: colors.glassBorder }]}>
            <View>
              <Text style={[type.caption, { color: colors.textMuted }]}>{VEHICLE_LABEL[selectedOption.vehicleType]} · {selectedOption.etaMinutes} min away</Text>
              <Text style={[type.title, { color: colors.textPrimary }]}>₹{selectedOption.priceEstimate}</Text>
            </View>
            <View style={{ width: 160 }}>
              <PrimaryButton label={loading ? "Booking..." : "Book ride"} onPress={book} loading={loading} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconWrap: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  stickyWrap: { position: "absolute", left: 0, right: 0, bottom: 0, overflow: "hidden" },
  stickyBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1 },
});
