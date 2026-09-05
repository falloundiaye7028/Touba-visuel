import { redirect } from "next/navigation";

export default function DemoPage() {
  const demoEnabled = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  redirect(demoEnabled ? "/dashboard" : "/login?demo=unavailable");
}
