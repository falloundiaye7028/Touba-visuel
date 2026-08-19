import { redirect } from "next/navigation";
import { getUserId } from "@/lib/sama/tenant";
import NewBusinessForm from "@/components/sama/NewBusinessForm";

export const dynamic = "force-dynamic";

export default async function NouvelleEntreprisePage() {
  const userId = await getUserId();
  if (!userId) redirect("/sama/connexion");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-vert-900 to-vert-700">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900">Créer votre entreprise</h1>
        <p className="text-sm text-gray-500 mt-1">Configurez votre espace de gestion.</p>
        <NewBusinessForm />
      </div>
    </div>
  );
}
