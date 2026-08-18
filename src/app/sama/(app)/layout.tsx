import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { planByCode } from "@/lib/sama/constants";
import { prisma } from "@/lib/db";
import TopBar from "@/components/sama/TopBar";
import SideNav from "@/components/sama/SideNav";
import BottomNav from "@/components/sama/BottomNav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { business, userId } = await requireOnboardedTenant();
  const [unread, user, memberships] = await Promise.all([
    prisma.samaNotification.count({ where: { businessId: business.id, read: false } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
    prisma.samaMember.findMany({ where: { userId, active: true }, include: { business: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } }),
  ]);
  const userName = user?.name || user?.email || "Utilisateur";
  const businesses = memberships.map((m) => ({ id: m.business.id, name: m.business.name }));

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        businessName={business.name}
        planName={planByCode(business.planCode).name}
        userName={userName}
        unread={unread}
        slug={business.slug}
        storePublished={business.storePublished}
        businesses={businesses}
        activeId={business.id}
      />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 min-w-0 pb-24 md:pb-8">
          <div className="max-w-3xl md:max-w-5xl mx-auto px-3 sm:px-4 py-4">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
