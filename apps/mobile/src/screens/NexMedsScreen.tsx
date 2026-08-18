import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Medicine } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { GlassCard } from "../components/GlassCard";
import { PressableScale } from "../components/PressableScale";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

export function NexMedsScreen() {
  const { colors, spacing, type } = useTheme();
  const navigation = useNavigation<any>();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
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
      const res = await apiRequest<{ order: { id: string } }>("/meds/orders", { method: "POST", body: { medicineIds: [selected] } });
      navigation.replace("Tracking", { kind: "meds", id: res.order.id });
    } finally {
      setLoading(false);
    }
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
            <PressableScale key={m.id} onPress={() => setSelected(m.id)} scaleTo={0.98}>
              <GlassCard accentColor={isSelected ? brand.meds : undefined}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View>
                    <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{m.name}</Text>
                    <Text style={[type.caption, { color: colors.textMuted }]}>{m.packSize}{m.requiresPrescription ? " · Prescription required" : ""}</Text>
                  </View>
                  <Text style={[type.subtitle, { color: colors.textPrimary }]}>₹{m.price}</Text>
                </View>
              </GlassCard>
            </PressableScale>
          );
        })}
      </View>

      <PrimaryButton label={loading ? "Placing order..." : "Order now"} onPress={order} disabled={!selected} loading={loading} />
    </Screen>
  );
}
