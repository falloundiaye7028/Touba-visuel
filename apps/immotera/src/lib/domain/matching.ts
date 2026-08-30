type PropertyCandidate = { type: string; city: string; district?: string; rent: number; bedrooms?: number; area?: number; amenities?: string[]; available: boolean };
type LeadCriteria = { type?: string; areas?: string[]; minBudget?: number; maxBudget?: number; bedrooms?: number; minArea?: number; amenities?: string[] };

export function matchProperty(property: PropertyCandidate, lead: LeadCriteria) {
  const weights = { type: 25, location: 25, budget: 25, bedrooms: 10, area: 8, amenities: 7, availability: 100 };
  if (!property.available) return { score: 0, reasons: ["Bien indisponible"] };
  let score = 0;
  const reasons: string[] = [];
  if (!lead.type || property.type.toLowerCase() === lead.type.toLowerCase()) { score += weights.type; reasons.push("Type compatible"); }
  const location = `${property.district ?? ""} ${property.city}`.toLowerCase();
  if (!lead.areas?.length || lead.areas.some((area) => location.includes(area.toLowerCase()))) { score += weights.location; reasons.push("Zone compatible"); }
  if ((lead.minBudget === undefined || property.rent >= lead.minBudget) && (lead.maxBudget === undefined || property.rent <= lead.maxBudget)) { score += weights.budget; reasons.push("Budget compatible"); }
  if (lead.bedrooms === undefined || (property.bedrooms ?? 0) >= lead.bedrooms) score += weights.bedrooms;
  if (lead.minArea === undefined || (property.area ?? 0) >= lead.minArea) score += weights.area;
  const requested = lead.amenities ?? [];
  if (!requested.length || requested.every((amenity) => property.amenities?.includes(amenity))) score += weights.amenities;
  return { score: Math.min(100, score), reasons };
}
