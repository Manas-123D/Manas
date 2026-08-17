import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RideOption, RideVehicleType } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

// Demo route: home -> work, from the seeded Hyderabad demo account.
const PICKUP = { lat: 17.4401, lng: 78.3489, label: "Home" };
const DROPOFF = { lat: 17.4483, lng: 78.3915, label: "Work" };

const VEHICLE_LABEL: Record<RideVehicleType, string> = { bike: "Bike", auto: "Auto", cab: "Cab", pool: "Pool" };

export function NexRideScreen() {
  const { colors, spacing, radius, type } = useTheme();
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

  return (
    <Screen>
      <View>
        <Text style={[type.micro, { color: brand.ride }]}>NEXRIDE</Text>
        <Text style={[type.title, { color: colors.textPrimary }]}>{PICKUP.label} → {DROPOFF.label}</Text>
      </View>

      <View style={{ gap: spacing.md }}>
        {options.map((o) => {
          const isSelected = selected === o.vehicleType;
          return (
            <Pressable
              key={o.vehicleType}
              onPress={() => setSelected(o.vehicleType)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderColor: isSelected ? brand.ride : colors.border,
                borderWidth: isSelected ? 2 : 1,
                borderRadius: radius.lg,
                padding: spacing.lg,
              }}
            >
              <View>
                <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{VEHICLE_LABEL[o.vehicleType]}</Text>
                <Text style={[type.caption, { color: colors.textMuted }]}>{o.etaMinutes} min away{o.surge > 1 ? " · surge pricing" : ""}</Text>
              </View>
              <Text style={[type.subtitle, { color: colors.textPrimary }]}>₹{o.priceEstimate}</Text>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label={loading ? "Please wait..." : "Book ride"} onPress={book} disabled={!selected} loading={loading} />
    </Screen>
  );
}
