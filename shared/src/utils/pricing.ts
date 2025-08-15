import { GeoPoint } from "../types";
import { calculateDistanceKm } from "./distance";

export interface PriceBreakdown {
  baseFare: number;
  distanceKm: number;
  distanceFare: number;
  total: number;
}

export interface PricingOptions {
  baseFare: number; // cents
  perKm: number; // cents per km
  minFare?: number; // cents
}

const DEFAULT_PRICING: PricingOptions = {
  baseFare: 500, // R$5,00
  perKm: 150, // R$1,50/km
  minFare: 700, // R$7,00
};

export function calculatePriceFromPoints(
  origin: GeoPoint,
  destination: GeoPoint,
  options: PricingOptions = DEFAULT_PRICING
): PriceBreakdown {
  const distanceKm = calculateDistanceKm(origin, destination);
  const distanceFare = Math.round(distanceKm * options.perKm);
  const subtotal = options.baseFare + distanceFare;
  const total = Math.max(subtotal, options.minFare ?? 0);
  return { baseFare: options.baseFare, distanceKm, distanceFare, total };
}

export function formatCurrencyCents(valueCents: number, locale = "pt-BR", currency = "BRL"): string {
  return (valueCents / 100).toLocaleString(locale, { style: "currency", currency });
}