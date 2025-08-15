import { calculateDistanceKm } from "./distance";
const DEFAULT_PRICING = {
    baseFare: 500, // R$5,00
    perKm: 150, // R$1,50/km
    minFare: 700, // R$7,00
};
export function calculatePriceFromPoints(origin, destination, options = DEFAULT_PRICING) {
    const distanceKm = calculateDistanceKm(origin, destination);
    const distanceFare = Math.round(distanceKm * options.perKm);
    const subtotal = options.baseFare + distanceFare;
    const total = Math.max(subtotal, options.minFare ?? 0);
    return { baseFare: options.baseFare, distanceKm, distanceFare, total };
}
export function formatCurrencyCents(valueCents, locale = "pt-BR", currency = "BRL") {
    return (valueCents / 100).toLocaleString(locale, { style: "currency", currency });
}
