import { GeoPoint } from "../types";
export interface PriceBreakdown {
    baseFare: number;
    distanceKm: number;
    distanceFare: number;
    total: number;
}
export interface PricingOptions {
    baseFare: number;
    perKm: number;
    minFare?: number;
}
export declare function calculatePriceFromPoints(origin: GeoPoint, destination: GeoPoint, options?: PricingOptions): PriceBreakdown;
export declare function formatCurrencyCents(valueCents: number, locale?: string, currency?: string): string;
