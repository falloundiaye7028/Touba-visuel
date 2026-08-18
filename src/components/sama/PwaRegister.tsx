"use client";

import { useEffect } from "react";

/** Enregistre le service worker SAMA (PWA installable, mode hors-ligne léger). */
export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sama-sw.js", { scope: "/sama" }).catch(() => {});
    }
  }, []);
  return null;
}
