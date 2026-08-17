import Anthropic from "@anthropic-ai/sdk";
import { HomeServiceCategory, RideVehicleType } from "@nexserv/shared";
import { quoteRideOptions, createRideRequest } from "../modules/rides/service";
import { listRestaurants, createFoodOrder } from "../modules/food/service";
import { listMedicines, refillLastOrder } from "../modules/meds/service";
import { createHomeServiceRequest } from "../modules/home/service";
import { AggregatedContext } from "./types";

// These are the only actions Myra is allowed to take on a user's behalf, and
// only after the user approves them in chat (see chatService.ts). Every tool
// here maps 1:1 to a real booking/order mutation — Myra never gets a raw DB
// or "do anything" tool.
export const MYRA_TOOLS: Anthropic.Tool[] = [
  {
    name: "get_ride_quotes",
    description: "Get live price and ETA estimates for all vehicle types between two points.",
    input_schema: {
      type: "object",
      properties: {
        pickupLat: { type: "number" },
        pickupLng: { type: "number" },
        dropoffLat: { type: "number" },
        dropoffLng: { type: "number" },
      },
      required: ["pickupLat", "pickupLng", "dropoffLat", "dropoffLng"],
    },
  },
  {
    name: "book_ride",
    description: "Book a ride after the user has approved a specific vehicle type and price.",
    input_schema: {
      type: "object",
      properties: {
        pickupLat: { type: "number" },
        pickupLng: { type: "number" },
        dropoffLat: { type: "number" },
        dropoffLng: { type: "number" },
        vehicleType: { type: "string", enum: ["bike", "auto", "cab", "pool"] },
      },
      required: ["pickupLat", "pickupLng", "dropoffLat", "dropoffLng", "vehicleType"],
    },
  },
  {
    name: "list_restaurants",
    description: "List restaurants available in the user's city, with menus.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "place_food_order",
    description: "Place a food order after the user approves the restaurant and items.",
    input_schema: {
      type: "object",
      properties: {
        restaurantId: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: { itemId: { type: "string" }, quantity: { type: "number" } },
            required: ["itemId", "quantity"],
          },
        },
      },
      required: ["restaurantId", "items"],
    },
  },
  {
    name: "list_medicines",
    description: "List medicines available for order.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "refill_last_medicine_order",
    description: "Refill the user's most recent medicine order after they approve it. Never use this to change dosage or recommend a substitute.",
    input_schema: {
      type: "object",
      properties: { medicineId: { type: "string", description: "Optional: refill only this specific medicine" } },
    },
  },
  {
    name: "book_home_service",
    description: "Schedule a home service technician visit after the user approves the category, description and time.",
    input_schema: {
      type: "object",
      properties: {
        category: { type: "string", enum: ["electrician", "plumber", "ac_technician", "cleaning", "appliance_repair"] },
        description: { type: "string" },
        scheduledForIso: { type: "string", description: "ISO timestamp for the visit" },
      },
      required: ["category", "description", "scheduledForIso"],
    },
  },
];

export async function executeTool(userId: string, ctx: AggregatedContext, name: string, input: Record<string, any>) {
  switch (name) {
    case "get_ride_quotes":
      return quoteRideOptions(
        { lat: input.pickupLat, lng: input.pickupLng },
        { lat: input.dropoffLat, lng: input.dropoffLng },
        ctx.traffic.level
      );
    case "book_ride":
      return createRideRequest(
        userId,
        { lat: input.pickupLat, lng: input.pickupLng },
        { lat: input.dropoffLat, lng: input.dropoffLng },
        input.vehicleType as RideVehicleType,
        ctx.traffic.level
      );
    case "list_restaurants":
      return listRestaurants(ctx.city);
    case "place_food_order":
      return createFoodOrder(userId, input.restaurantId, input.items);
    case "list_medicines":
      return listMedicines();
    case "refill_last_medicine_order":
      return refillLastOrder(userId, input.medicineId);
    case "book_home_service":
      return createHomeServiceRequest(
        userId,
        input.category as HomeServiceCategory,
        input.description,
        new Date(input.scheduledForIso)
      );
    default:
      throw new Error(`Unknown Myra tool: ${name}`);
  }
}
