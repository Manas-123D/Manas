// Shared domain types used by both the NexServ API and the mobile app.
// Keeping these in one package means Myra's payloads and the UI never drift apart.

export type ServiceKind = "ride" | "food" | "meds" | "home";

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city: string;
  homeLocation?: GeoPoint;
  workLocation?: GeoPoint;
  createdAt: string;
}

// ---------- Myra: context, insights & chat ----------

export type ContextSignalType =
  | "location"
  | "calendar"
  | "weather"
  | "traffic"
  | "time"
  | "service_history"
  | "preference";

export interface ContextSignal {
  type: ContextSignalType;
  payload: Record<string, unknown>;
  observedAt: string;
}

export type MyraInsightAction =
  | { kind: "book_ride"; params: { pickup: GeoPoint; dropoff: GeoPoint; leaveInMinutes?: number } }
  | { kind: "reorder_food"; params: { restaurantId: string; itemIds: string[] } }
  | { kind: "schedule_home_service"; params: { category: HomeServiceCategory; suggestedSlot: string } }
  | { kind: "refill_medicine"; params: { medicineId: string } }
  | { kind: "open_screen"; params: { screen: ServiceKind } };

export interface MyraInsight {
  id: string;
  userId: string;
  headline: string;
  detail: string;
  confidence: number; // 0-1, how sure Myra is this is useful right now
  service: ServiceKind | "general";
  action?: MyraInsightAction;
  createdAt: string;
  dismissed?: boolean;
}

export type ChatRole = "user" | "myra" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  proposedAction?: MyraInsightAction;
}

// ---------- NexRide ----------

export type RideVehicleType = "bike" | "auto" | "cab" | "pool";
export type RideStatus = "requested" | "matched" | "ongoing" | "completed" | "cancelled";

export interface RideOption {
  vehicleType: RideVehicleType;
  etaMinutes: number;
  priceEstimate: number;
  surge: number;
}

// Matches the flat lat/lng columns Prisma actually stores (see RideRequest
// in schema.prisma) - there's no origin/destination label persisted server-side.
export interface RideRequest {
  id: string;
  userId: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  vehicleType: RideVehicleType;
  status: RideStatus;
  priceEstimate: number;
  etaMinutes: number;
  driverName?: string;
  createdAt: string;
}

// ---------- NexFood ----------

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  prepTimeMinutes: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  etaMinutes: number;
  distanceKm: number;
  lat: number;
  lng: number;
  trending: boolean;
  offer?: string | null;
  menuItems: MenuItem[];
}

export type FoodOrderStatus = "placed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

export interface FoodOrder {
  id: string;
  userId: string;
  restaurantId: string;
  items: { itemId: string; quantity: number }[];
  status: FoodOrderStatus;
  total: number;
  etaMinutes: number;
  createdAt: string;
}

// ---------- NexMeds ----------

export interface Medicine {
  id: string;
  name: string;
  requiresPrescription: boolean;
  price: number;
  packSize: string;
}

export type MedOrderStatus = "placed" | "packed" | "out_for_delivery" | "delivered" | "cancelled";

export interface MedOrder {
  id: string;
  userId: string;
  medicineIds: string[];
  status: MedOrderStatus;
  etaMinutes: number;
  createdAt: string;
  refillOfOrderId?: string;
}

// ---------- NexHome ----------

export type HomeServiceCategory =
  | "electrician"
  | "plumber"
  | "ac_technician"
  | "cleaning"
  | "appliance_repair";

export type HomeServiceStatus = "requested" | "assigned" | "in_progress" | "completed" | "cancelled";

export interface HomeServiceRequest {
  id: string;
  userId: string;
  category: HomeServiceCategory;
  description: string;
  scheduledFor: string;
  status: HomeServiceStatus;
  technicianName?: string;
  priceEstimate: number;
  createdAt: string;
}

// ---------- NexCare (partners) ----------

export type PartnerRole =
  | "driver"
  | "delivery_partner"
  | "electrician"
  | "plumber"
  | "ac_technician"
  | "cleaner"
  | "appliance_technician";

export interface PartnerProfile {
  id: string;
  name: string;
  role: PartnerRole;
  city: string;
  rating: number;
  completedJobs: number;
  loyaltyTier: "bronze" | "silver" | "gold" | "platinum";
  loyaltyPoints: number;
  trainingModulesCompleted: number;
}

export interface PartnerIncentive {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  kind: "financial" | "wellbeing" | "growth" | "recognition";
  achievedAt?: string;
}

// ---------- Live tracking (rides, food & meds deliveries) ----------

export type TrackingKind = "ride" | "food" | "meds";

export interface TrackingState {
  kind: TrackingKind;
  status: string;
  progress: number; // 0-1, fraction of the route completed
  agentName: string;
  agentLocation: GeoPoint;
  origin: GeoPoint;
  destination: GeoPoint;
  etaRemainingMinutes: number;
  totalEtaMinutes: number;
}
