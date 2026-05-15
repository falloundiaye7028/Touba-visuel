"use client";
import Image from "next/image";

export default function MockupLateral() {
  return (
    <>
      {/* ── CÔTÉ GAUCHE — Mockup Téléphone ── */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-10 hidden xl:flex flex-col items-center gap-6 pl-4 pointer-events-none select-none opacity-75 hover:opacity-95 transition-opacity duration-500">

        {/* Phone mockup */}
        <div className="relative animate-float" style={{ transform: "rotate(-8deg)" }}>
          <div className="w-[130px] h-[260px] bg-gray-900 rounded-[32px] border-2 border-gray-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Encoche */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-14 h-2.5 bg-gray-800 rounded-full" />
            </div>
            {/* Écran */}
            <div className="flex-1 mx-2.5 mb-2.5 rounded-2xl overflow-hidden bg-gradient-to-b from-vert-900 to-black flex flex-col items-center justify-center gap-2.5 p-2">
              {/* Logo ATV */}
              <div className="w-20 h-20 relative rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/atv-logo-3d.jpg" alt="ATV Logo" fill className="object-cover" sizes="80px" />
              </div>
              <p className="text-white/80 text-[9px] font-bold tracking-widest text-center leading-tight">TOUBA<br/>VISUEL</p>
              <p className="text-white/40 text-[7px] tracking-wider text-center">IMAGE & COMMUNICATION</p>
              {/* Mini barres */}
              <div className="w-full space-y-1.5 mt-1 px-1">
                <div className="h-1.5 bg-vert-600/60 rounded-full" />
                <div className="h-1.5 bg-vert-600/40 rounded-full w-3/4 mx-auto" />
                <div className="h-1.5 bg-white/20 rounded-full w-5/6 mx-auto" />
                <div className="h-1.5 bg-vert-400/30 rounded-full w-2/3 mx-auto" />
              </div>
            </div>
          </div>
          {/* Boutons côtés */}
          <div className="absolute -right-1 top-14 w-1 h-8 bg-gray-600 rounded-r" />
          <div className="absolute -left-1 top-12 w-1 h-6 bg-gray-600 rounded-l" />
          <div className="absolute -left-1 top-24 w-1 h-6 bg-gray-600 rounded-l" />
          {/* Reflet */}
          <div className="absolute top-4 left-3 w-6 h-20 bg-white/5 rounded-full blur-sm" />
        </div>

        {/* Carte de visite */}
        <div className="relative animate-float-reverse" style={{ transform: "rotate(6deg)" }}>
          <div className="w-[160px] h-[95px] bg-gradient-to-br from-vert-800 to-vert-950 rounded-xl border border-vert-600/30 shadow-2xl flex flex-col items-start justify-between p-3 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 relative rounded-lg overflow-hidden border border-white/10 shadow">
                <Image src="/images/atv-logo-3d.jpg" alt="ATV" fill className="object-cover" sizes="36px" />
              </div>
              <div>
                <p className="text-white font-black text-[10px] tracking-wide leading-none">TOUBA VISUEL</p>
                <p className="text-white/50 text-[8px] tracking-widest leading-tight mt-0.5">IMAGE & COMMUNICATION</p>
              </div>
            </div>
            <div className="space-y-1 w-full">
              <div className="h-0.5 w-full bg-vert-400/40 rounded-full" />
              <p className="text-white/40 text-[7px] tracking-wider">+221 77 800 17 17</p>
            </div>
          </div>
        </div>

        {/* Flyer vertical */}
        <div className="relative animate-float-slow" style={{ transform: "rotate(-4deg)" }}>
          <div className="w-[100px] h-[145px] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="h-14 relative overflow-hidden">
              <Image src="/images/atv-logo-3d.jpg" alt="ATV" fill className="object-cover object-center" sizes="100px" />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            {/* Corps */}
            <div className="p-2 space-y-1.5">
              <div className="h-1.5 bg-gray-300 rounded-full" />
              <div className="h-1.5 bg-gray-200 rounded-full w-3/4" />
              <div className="h-1.5 bg-gray-300 rounded-full w-5/6" />
              <div className="h-7 bg-vert-50 border border-vert-200 rounded mt-1.5 flex items-center justify-center">
                <p className="text-vert-700 text-[7px] font-bold">Commander →</p>
              </div>
            </div>
            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-vert-800 flex items-center justify-center">
              <p className="text-white/70 text-[5px] tracking-widest">ATV</p>
            </div>
          </div>
        </div>

        {/* Label vertical */}
        <div className="mt-2" style={{ transform: "rotate(-90deg)" }}>
          <p className="text-gray-400/30 text-[9px] font-semibold tracking-[0.4em] uppercase whitespace-nowrap">Touba Visuel</p>
        </div>
      </div>

      {/* ── CÔTÉ DROIT — Mockup Roll-up + T-shirt + Banderole ── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10 hidden xl:flex flex-col items-center gap-6 pr-4 pointer-events-none select-none opacity-75 hover:opacity-95 transition-opacity duration-500">

        {/* Roll-up banner */}
        <div className="relative animate-float-slow" style={{ transform: "rotate(7deg)" }}>
          <div className="w-[72px] h-[200px] flex flex-col items-center">
            <div className="w-full flex-1 bg-gradient-to-b from-vert-900 via-vert-800 to-vert-950 rounded-t shadow-2xl border border-vert-600/20 flex flex-col items-center justify-between py-3 px-1.5 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-4 bg-black/30" />
              <div className="mt-4 text-center">
                <p className="text-white font-black text-[8px] tracking-widest leading-tight">TOUBA<br/>VISUEL</p>
                <p className="text-white/40 text-[6px] mt-1">IMAGE & COM.</p>
              </div>
              <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <Image src="/images/atv-logo-3d.jpg" alt="ATV" fill className="object-cover" sizes="56px" />
              </div>
              <div className="space-y-1 w-full">
                <div className="h-0.5 bg-white/20 rounded-full" />
                <div className="h-0.5 bg-vert-400/30 rounded-full" />
              </div>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-b" />
            <div className="w-1.5 h-5 bg-gray-600" />
            <div className="w-20 h-1.5 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* T-shirt mockup */}
        <div className="relative animate-float" style={{ transform: "rotate(-6deg)" }}>
          <svg width="130" height="112" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl filter">
            <path d="M10 8 L20 2 L27 8 L35 4 L43 8 L50 2 L60 8 L65 22 L52 20 L52 56 L18 56 L18 20 L5 22 Z"
              fill="#0a6342" stroke="#07402b" strokeWidth="0.8" />
            <ellipse cx="35" cy="6" rx="8" ry="4" fill="#07402b" />
            <text x="35" y="33" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial" letterSpacing="1.5">ATV</text>
            <text x="35" y="43" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="3.5" fontWeight="700" fontFamily="Arial" letterSpacing="2">TOUBA VISUEL</text>
            <path d="M18 8 L18 25 L25 22 L25 10 Z" fill="white" opacity="0.06" />
          </svg>
        </div>

        {/* Banderole */}
        <div className="relative animate-float-reverse" style={{ transform: "rotate(4deg)" }}>
          <div className="w-[165px] h-[62px] bg-gradient-to-r from-vert-900 to-vert-700 rounded-lg shadow-2xl border border-vert-600/30 flex flex-col items-center justify-center gap-1 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/30" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30" />
            <p className="text-white font-black text-[10px] tracking-[0.25em] uppercase">TOUBA VISUEL</p>
            <p className="text-white/50 text-[7px] tracking-widest uppercase">Agence Communication</p>
            <div className="flex gap-1 mt-0.5">
              <div className="w-8 h-0.5 bg-vert-400/40 rounded-full" />
              <div className="w-4 h-0.5 bg-white/20 rounded-full" />
            </div>
            {/* Cordes */}
            <div className="absolute -top-2 left-4 w-0.5 h-3 bg-gray-500" />
            <div className="absolute -top-2 right-4 w-0.5 h-3 bg-gray-500" />
          </div>
        </div>

        {/* Label vertical */}
        <div className="mt-2" style={{ transform: "rotate(90deg)" }}>
          <p className="text-gray-400/30 text-[9px] font-semibold tracking-[0.4em] uppercase whitespace-nowrap">Touba Visuel</p>
        </div>
      </div>
    </>
  );
}
