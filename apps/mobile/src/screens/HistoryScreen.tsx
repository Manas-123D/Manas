import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  FoodOrder,
  HomeServiceRequest,
  MedOrder,
  Medicine,
  Restaurant,
  RideRequest,
} from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { GlassCard } from "../components/GlassCard";
import { useTheme, brand, gradients } from "../theme";
import { apiRequest } from "../api/client";

type HistoryKind = "ride" | "food" | "meds" | "home";

interface HistoryItem {
  id: string;
  kind: HistoryKind;
  title: string;
  subtitle: string;
  price: number;
  status: string;
  createdAt: string;
}

const KIND_ICON: Record<HistoryKind, keyof typeof Ionicons.glyphMap> = {
  ride: "car-sport",
  food: "restaurant",
  meds: "medkit",
  home: "construct",
};
const KIND_COLOR: Record<HistoryKind, string> = { ride: brand.ride, food: brand.food, meds: brand.meds, home: brand.home };
const KIND_GRADIENT: Record<HistoryKind, readonly [string, string]> = { ride: gradients.ride, food: gradients.food, meds: gradients.meds, home: gradients.home };

const TERMINAL_STATUSES = new Set(["completed", "delivered"]);
const CANCELLED_STATUSES = new Set(["cancelled"]);

const STATUS_LABEL: Record<string, string> = {
  requested: "Requested",
  matched: "Matched",
  ongoing: "On the way",
  completed: "Completed",
  placed: "Placed",
  preparing: "Preparing",
  packed: "Packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  assigned: "Assigned",
  in_progress: "In progress",
  cancelled: "Cancelled",
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

export function HistoryScreen() {
  const { colors, spacing, radius, type } = useTheme();
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<HistoryItem[] | null>(null);

  useEffect(() => {
    Promise.all([
      apiRequest<{ rides: RideRequest[] }>("/rides").catch(() => ({ rides: [] })),
      apiRequest<{ orders: FoodOrder[] }>("/food/orders").catch(() => ({ orders: [] })),
      apiRequest<{ restaurants: Restaurant[] }>("/food/restaurants").catch(() => ({ restaurants: [] })),
      apiRequest<{ orders: MedOrder[] }>("/meds/orders").catch(() => ({ orders: [] })),
      apiRequest<{ medicines: Medicine[] }>("/meds/medicines").catch(() => ({ medicines: [] })),
      apiRequest<{ requests: HomeServiceRequest[] }>("/home/requests").catch(() => ({ requests: [] })),
    ]).then(([ridesRes, foodRes, restaurantsRes, medsRes, medicinesRes, homeRes]) => {
      const restaurantById = new Map(restaurantsRes.restaurants.map((r) => [r.id, r]));
      const medicineById = new Map(medicinesRes.medicines.map((m) => [m.id, m.name]));

      const rides: HistoryItem[] = ridesRes.rides.map((r) => ({
        id: r.id,
        kind: "ride",
        title: `${r.vehicleType[0].toUpperCase()}${r.vehicleType.slice(1)} ride`,
        subtitle: r.driverName ?? "Driver assigned",
        price: r.priceEstimate,
        status: r.status,
        createdAt: r.createdAt,
      }));

      const food: HistoryItem[] = foodRes.orders.map((o) => {
        const restaurant = restaurantById.get(o.restaurantId);
        const itemCount = o.items.reduce((sum, i) => sum + i.quantity, 0);
        return {
          id: o.id,
          kind: "food",
          title: restaurant?.name ?? "Restaurant order",
          subtitle: `${itemCount} item${itemCount === 1 ? "" : "s"}`,
          price: o.total,
          status: o.status,
          createdAt: o.createdAt,
        };
      });

      const meds: HistoryItem[] = medsRes.orders.map((o) => ({
        id: o.id,
        kind: "meds",
        title: o.medicineIds.map((id) => medicineById.get(id) ?? "Medicine").join(", "),
        subtitle: o.refillOfOrderId ? "Refill" : "Order",
        price: 0,
        status: o.status,
        createdAt: o.createdAt,
      }));

      const home: HistoryItem[] = homeRes.requests.map((h) => ({
        id: h.id,
        kind: "home",
        title: h.category.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
        subtitle: h.technicianName ? `${h.technicianName} · ${h.description}` : h.description,
        price: h.priceEstimate,
        status: h.status,
        createdAt: h.createdAt,
      }));

      const all = [...rides, ...food, ...meds, ...home].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setItems(all);
    });
  }, []);

  function statusTone(status: string): "done" | "cancelled" | "active" {
    if (CANCELLED_STATUSES.has(status)) return "cancelled";
    if (TERMINAL_STATUSES.has(status)) return "done";
    return "active";
  }

  function openItem(item: HistoryItem) {
    if (item.kind === "home") return; // no live tracking for home service visits
    navigation.navigate("Tracking", { kind: item.kind, id: item.id });
  }

  return (
    <Screen>
      <Text style={[type.title, { color: colors.textPrimary }]}>My Bookings</Text>

      {items === null && <Text style={[type.body, { color: colors.textMuted }]}>Loading...</Text>}

      {items?.length === 0 && (
        <GlassCard>
          <Text style={[type.body, { color: colors.textSecondary }]}>
            Nothing here yet — once you book a ride, order food, refill a prescription or schedule a home visit, it'll show up here.
          </Text>
        </GlassCard>
      )}

      <View style={{ gap: spacing.md }}>
        {items?.map((item) => {
          const tone = statusTone(item.status);
          const toneColor = tone === "cancelled" ? colors.danger : tone === "done" ? colors.success : KIND_COLOR[item.kind];
          const isPressable = item.kind !== "home";

          return (
            <Pressable key={`${item.kind}-${item.id}`} onPress={() => openItem(item)} disabled={!isPressable}>
              <GlassCard>
                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  <LinearGradient
                    colors={KIND_GRADIENT[item.kind]}
                    start={{ x: 0.15, y: 0.1 }}
                    end={{ x: 0.9, y: 1 }}
                    style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" }}
                  >
                    <Ionicons name={KIND_ICON[item.kind]} size={18} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Text style={[type.bodyStrong, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      {item.price > 0 && <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>₹{item.price}</Text>}
                    </View>
                    <Text style={[type.caption, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm }}>
                      <Text style={[type.caption, { color: colors.textMuted }]}>{formatDate(item.createdAt)}</Text>
                      <View style={{ backgroundColor: toneColor + "1c", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
                        <Text style={[type.micro, { color: toneColor }]}>{(STATUS_LABEL[item.status] ?? item.status).toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
