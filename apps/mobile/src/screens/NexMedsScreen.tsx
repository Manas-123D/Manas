import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Medicine } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

export function NexMedsScreen() {
  const { colors, spacing, radius, type } = useTheme();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ etaMinutes: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest<{ medicines: Medicine[]; disclaimer: string }>("/meds/medicines").then((res) => {
      setMedicines(res.medicines);
      setDisclaimer(res.disclaimer);
    });
  }, []);

  async function order() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await apiRequest<{ order: { etaMinutes: number } }>("/meds/orders", { method: "POST", body: { medicineIds: [selected] } });
      setConfirmed(res.order);
    } finally {
      setLoading(false);
    }
  }

  if (confirmed) {
    return (
      <Screen>
        <Text style={[type.title, { color: colors.textPrimary }]}>Order placed 💊</Text>
        <Text style={[type.subtitle, { color: colors.textPrimary }]}>Arriving in ~{confirmed.etaMinutes} min</Text>
        <PrimaryButton label="Order again" onPress={() => { setConfirmed(null); setSelected(null); }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={[type.micro, { color: brand.meds }]}>NEXMEDS</Text>
      <Text style={[type.title, { color: colors.textPrimary }]}>Order medicines</Text>
      <Text style={[type.caption, { color: colors.textMuted }]}>{disclaimer}</Text>

      <View style={{ gap: spacing.sm }}>
        {medicines.map((m) => {
          const isSelected = selected === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setSelected(m.id)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderColor: isSelected ? brand.meds : colors.border,
                borderWidth: isSelected ? 2 : 1,
                borderRadius: radius.lg,
                padding: spacing.lg,
              }}
            >
              <View>
                <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{m.name}</Text>
                <Text style={[type.caption, { color: colors.textMuted }]}>{m.packSize}{m.requiresPrescription ? " · Prescription required" : ""}</Text>
              </View>
              <Text style={[type.subtitle, { color: colors.textPrimary }]}>₹{m.price}</Text>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label={loading ? "Placing order..." : "Order now"} onPress={order} disabled={!selected} loading={loading} />
    </Screen>
  );
}
