import Link from "next/link";
import { APP_SLOGAN } from "@/lib/sama/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-vert-900 via-vert-800 to-vert-700">
      <Link href="/sama" className="mb-6 text-center">
        <div className="text-2xl font-extrabold text-white tracking-tight">SAMA BUSINESS</div>
        <div className="text-vert-100 text-sm mt-0.5">{APP_SLOGAN}</div>
      </Link>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">{children}</div>
      <p className="text-vert-100/80 text-xs mt-6">© {new Date().getFullYear()} SAMA BUSINESS · Sénégal</p>
    </div>
  );
}
