import { redirect } from "next/navigation";
import { requireTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import OnboardingWizard from "@/components/sama/OnboardingWizard";
import { APP_NAME } from "@/lib/sama/constants";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { business } = await requireTenant();
  if (business.onboardingDone) redirect("/sama/dashboard");

  const [products, customers] = await Promise.all([
    prisma.samaProduct.count({ where: { businessId: business.id } }),
    prisma.samaCustomer.count({ where: { businessId: business.id } }),
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-5">
          <div className="text-xl font-extrabold text-vert-800">{APP_NAME}</div>
          <p className="text-sm text-gray-500 mt-1">Configurons votre entreprise en 3 étapes</p>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <OnboardingWizard businessName={business.name} hasProduct={products > 0} hasCustomer={customers > 0} />
        </div>
      </div>
    </div>
  );
}
