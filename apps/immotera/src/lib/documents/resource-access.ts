import "server-only";
import { db } from "@/lib/db";
import type { DocumentResourceType } from "./config";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function assertDocumentResourceAccess(organizationId: string, resourceType: DocumentResourceType, resourceId: string | null) {
  if (resourceType === "OTHER" && !resourceId) return { label: "Bibliothèque générale" };
  if (!resourceId || !uuidPattern.test(resourceId)) throw new Error("RESOURCE_NOT_FOUND");

  if (resourceType === "PROPERTY" || resourceType === "PROJECT") {
    const resource = await db.property.findFirst({ where: { id: resourceId, organizationId, deletedAt: null }, select: { name: true } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");
    return { label: resource.name };
  }
  if (resourceType === "BUILDING") {
    const resource = await db.building.findFirst({ where: { id: resourceId, organizationId, deletedAt: null }, select: { name: true } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");
    return { label: resource.name };
  }
  if (resourceType === "UNIT") {
    const resource = await db.unit.findFirst({ where: { id: resourceId, organizationId }, select: { number: true } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");
    return { label: `Unité ${resource.number}` };
  }
  if (resourceType === "OWNER") {
    const resource = await db.owner.findFirst({ where: { id: resourceId, organizationId, deletedAt: null }, select: { firstName: true, lastName: true, company: true } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");
    return { label: resource.company ?? [resource.firstName, resource.lastName].filter(Boolean).join(" ") };
  }
  if (resourceType === "TENANT") {
    const resource = await db.tenant.findFirst({ where: { id: resourceId, organizationId, deletedAt: null }, select: { firstName: true, lastName: true } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");
    return { label: [resource.firstName, resource.lastName].filter(Boolean).join(" ") };
  }
  if (resourceType === "CONTRACT") {
    const resource = await db.contract.findFirst({ where: { id: resourceId, organizationId, deletedAt: null }, select: { reference: true } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");
    return { label: resource.reference };
  }
  if (resourceType === "MAINTENANCE") {
    const resource = await db.maintenanceTicket.findFirst({ where: { id: resourceId, organizationId }, select: { reference: true } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");
    return { label: resource.reference };
  }
  if (resourceType === "VENDOR") {
    const resource = await db.vendor.findFirst({ where: { id: resourceId, organizationId, deletedAt: null }, select: { name: true } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");
    return { label: resource.name };
  }
  throw new Error("RESOURCE_NOT_FOUND");
}
