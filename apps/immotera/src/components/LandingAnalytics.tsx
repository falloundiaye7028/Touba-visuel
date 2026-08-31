"use client";

import { useEffect } from "react";

export type PublicAnalyticsEvent =
  | "landing_view"
  | "cta_start_free"
  | "cta_demo"
  | "pricing_view"
  | "pricing_plan_click"
  | "demo_open"
  | "register_start"
  | "register_complete";

type AnalyticsDetail = {
  name: PublicAnalyticsEvent;
  label?: string;
  path: string;
};

export function trackPublicEvent(name: PublicAnalyticsEvent, label?: string) {
  if (typeof window === "undefined") return;
  const detail: AnalyticsDetail = { name, label, path: window.location.pathname };
  window.dispatchEvent(new CustomEvent<AnalyticsDetail>("intelligenceimmobilier:analytics", { detail }));
}

export function LandingAnalytics() {
  useEffect(() => {
    trackPublicEvent("landing_view");

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics]") : null;
      if (!target) return;
      const names = target.dataset.analytics?.split(",") ?? [];
      for (const name of names) trackPublicEvent(name.trim() as PublicAnalyticsEvent, target.dataset.analyticsLabel);
    };

    document.addEventListener("click", onClick);

    const pricing = document.getElementById("tarifs");
    let pricingTracked = false;
    const observer = pricing && "IntersectionObserver" in window
      ? new IntersectionObserver(([entry], currentObserver) => {
          if (entry?.isIntersecting && !pricingTracked) {
            pricingTracked = true;
            trackPublicEvent("pricing_view");
            currentObserver.disconnect();
          }
        }, { threshold: 0.35 })
      : null;
    if (pricing && observer) observer.observe(pricing);

    return () => {
      document.removeEventListener("click", onClick);
      observer?.disconnect();
    };
  }, []);

  return null;
}
