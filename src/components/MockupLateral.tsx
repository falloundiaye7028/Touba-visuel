"use client";

export default function MockupLateral() {
  return (
    <>
      {/* ── CÔTÉ GAUCHE — Mockup Téléphone ── */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-10 hidden 2xl:flex flex-col items-center gap-4 pl-3 pointer-events-none select-none opacity-70 hover:opacity-90 transition-opacity duration-500">

        {/* Phone mockup */}
        <div className="relative animate-float" style={{ transform: "rotate(-8deg)" }}>
          {/* Corps du téléphone */}
          <div className="w-[72px] h-[140px] bg-gray-900 rounded-[18px] border-2 border-gray-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Encoche */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1.5 bg-gray-800 rounded-full" />
            </div>
            {/* Écran */}
            <div className="flex-1 mx-1.5 mb-1.5 rounded-xl overflow-hidden bg-gradient-to-b from-vert-900 to-black flex flex-col items-center justify-center gap-1.5 p-1">
              {/* Logo ATV mini */}
              <div className="w-8 h-8 bg-black border border-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-[9px]" style={{ textShadow: "0 0 6px #fff" }}>ATV</span>
              </div>
              <p className="text-white/80 text-[5px] font-bold tracking-widest text-center leading-tight">TOUBA<br/>VISUEL</p>
              {/* Mini barres de contenu */}
              <div className="w-full space-y-1 mt-1">
                <div className="h-1 bg-vert-600/60 rounded-full mx-1" />
                <div className="h-1 bg-vert-600/40 rounded-full mx-2" />
                <div className="h-1 bg-white/20 rounded-full mx-1.5" />
              </div>
            </div>
          </div>
          {/* Boutons côtés */}
          <div className="absolute -right-0.5 top-8 w-0.5 h-5 bg-gray-600 rounded-r" />
          <div className="absolute -left-0.5 top-7 w-0.5 h-4 bg-gray-600 rounded-l" />
          <div className="absolute -left-0.5 top-14 w-0.5 h-4 bg-gray-600 rounded-l" />
          {/* Reflet écran */}
          <div className="absolute top-2 left-2 w-4 h-10 bg-white/5 rounded-full blur-sm" />
        </div>

        {/* Carte de visite */}
        <div className="relative animate-float-reverse" style={{ transform: "rotate(6deg)" }}>
          <div className="w-[88px] h-[54px] bg-gradient-to-br from-vert-800 to-vert-950 rounded-lg border border-vert-600/30 shadow-xl flex flex-col items-start justify-between p-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-black border border-white/20 rounded flex items-center justify-center">
                <span className="text-white font-black text-[5px]">ATV</span>
              </div>
              <div>
                <p className="text-white font-black text-[5px] tracking-wide leading-none">TOUBA</p>
                <p className="text-white/60 text-[4px] tracking-widest leading-none">VISUEL</p>
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="h-0.5 w-12 bg-vert-400/50 rounded-full" />
              <div className="h-0.5 w-8 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Flyer vertical */}
        <div className="relative animate-float-slow" style={{ transform: "rotate(-4deg)" }}>
          <div className="w-[56px] h-[80px] bg-white rounded-md shadow-xl overflow-hidden border border-gray-200">
            {/* Header flyer */}
            <div className="h-8 bg-gradient-to-b from-vert-800 to-vert-700 flex items-center justify-center">
              <p className="text-white font-black text-[6px] tracking-widest">TOUBA VISUEL</p>
            </div>
            {/* Corps flyer */}
            <div className="p-1.5 space-y-1">
              <div className="h-1 bg-gray-300 rounded-full" />
              <div className="h-1 bg-gray-200 rounded-full w-3/4" />
              <div className="h-1 bg-gray-300 rounded-full" />
              <div className="h-4 bg-vert-100 rounded mt-1 flex items-center justify-center">
                <div className="h-1 w-8 bg-vert-600/40 rounded-full" />
              </div>
            </div>
            {/* Footer flyer */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-vert-800" />
          </div>
        </div>

        {/* Label */}
        <div className="mt-1" style={{ transform: "rotate(-90deg)" }}>
          <p className="text-gray-400/40 text-[8px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap">Touba Visuel</p>
        </div>
      </div>

      {/* ── CÔTÉ DROIT — Mockup Bannière + Roll-up ── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10 hidden 2xl:flex flex-col items-center gap-4 pr-3 pointer-events-none select-none opacity-70 hover:opacity-90 transition-opacity duration-500">

        {/* Roll-up banner */}
        <div className="relative animate-float-slow" style={{ transform: "rotate(7deg)" }}>
          <div className="w-[40px] h-[120px] flex flex-col items-center">
            {/* Panneau */}
            <div className="w-full flex-1 bg-gradient-to-b from-vert-900 via-vert-800 to-vert-950 rounded-t-sm shadow-xl border border-vert-600/20 flex flex-col items-center justify-between py-2 px-1 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-3 bg-black/30" />
              <div className="mt-3 text-center">
                <p className="text-white font-black text-[5px] tracking-widest leading-tight">TOUBA<br/>VISUEL</p>
              </div>
              <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center">
                <span className="text-white/80 font-black text-[7px]">ATV</span>
              </div>
              <div className="space-y-0.5 w-full">
                <div className="h-0.5 bg-white/20 rounded-full" />
                <div className="h-0.5 bg-vert-400/30 rounded-full" />
              </div>
            </div>
            {/* Pied roll-up */}
            <div className="w-full h-2 bg-gray-700 rounded-b" />
            <div className="w-1 h-3 bg-gray-600" />
            <div className="w-12 h-1 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* T-shirt mockup */}
        <div className="relative animate-float" style={{ transform: "rotate(-6deg)" }}>
          <svg width="70" height="60" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-xl filter">
            {/* T-shirt shape */}
            <path d="M10 8 L20 2 L27 8 L35 4 L43 8 L50 2 L60 8 L65 22 L52 20 L52 56 L18 56 L18 20 L5 22 Z"
              fill="#0a6342" stroke="#07402b" strokeWidth="1" />
            {/* Col */}
            <ellipse cx="35" cy="6" rx="8" ry="4" fill="#07402b" />
            {/* ATV text sur le t-shirt */}
            <text x="35" y="34" textAnchor="middle" fill="white" fontSize="8" fontWeight="900" fontFamily="Arial" letterSpacing="1">ATV</text>
            <text x="35" y="44" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="4" fontWeight="600" fontFamily="Arial" letterSpacing="2">TOUBA VISUEL</text>
            {/* Reflet */}
            <path d="M18 8 L18 25 L25 22 L25 10 Z" fill="white" opacity="0.05" />
          </svg>
        </div>

        {/* Banderole */}
        <div className="relative animate-float-reverse" style={{ transform: "rotate(4deg)" }}>
          <div className="w-[90px] h-[36px] bg-gradient-to-r from-vert-900 to-vert-700 rounded shadow-xl border border-vert-600/30 flex flex-col items-center justify-center gap-0.5 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/30" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30" />
            <p className="text-white font-black text-[6px] tracking-[0.2em] uppercase">TOUBA VISUEL</p>
            <p className="text-white/50 text-[4px] tracking-widest uppercase">Agence Communication</p>
            {/* Cordes */}
            <div className="absolute -top-1.5 left-2 w-0.5 h-2 bg-gray-500" />
            <div className="absolute -top-1.5 right-2 w-0.5 h-2 bg-gray-500" />
          </div>
        </div>

        {/* Label */}
        <div className="mt-1" style={{ transform: "rotate(90deg)" }}>
          <p className="text-gray-400/40 text-[8px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap">Touba Visuel</p>
        </div>
      </div>
    </>
  );
}
