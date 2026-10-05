import React from "react";

export function PlaneLoader({ label = "Loading your journey..." }) {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-black">

            {/* Soft ambient clouds */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-[20%] left-[10%] w-72 h-24 bg-white/70 dark:bg-white/[0.03] rounded-full blur-3xl" />
                <div className="absolute top-[60%] left-[55%] w-80 h-28 bg-white/60 dark:bg-white/[0.03] rounded-full blur-3xl" />
                <div className="absolute top-[35%] left-[35%] w-64 h-20 bg-blue-100/60 dark:bg-blue-900/10 rounded-full blur-3xl" />
            </div>

            {/* Flight path + plane */}
            <div className="relative w-full max-w-5xl h-32 flex items-center">

                {/* Dashed trail */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-sky-400/50 dark:border-sky-500/30 animate-trail" />
                </div>

                {/* Plane */}
                <div className="absolute top-1/2 -translate-y-1/2 animate-fly">
                    <div className="relative animate-bob">
                        {/* Motion streaks */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 flex flex-col gap-1 pr-3">
                            <span className="block h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent to-sky-400/70" />
                            <span className="block h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent to-sky-400/50" />
                            <span className="block h-[2px] w-8 rounded-full bg-gradient-to-r from-transparent to-sky-400/70" />
                        </div>

                        <svg
                            viewBox="0 0 24 24"
                            className="w-12 h-12 text-sky-600 dark:text-sky-400 drop-shadow-[0_6px_12px_rgba(14,165,233,0.35)]"
                            fill="currentColor"
                        >
                            <path d="M21.5 11.5c.3-.2.5-.5.5-.9s-.2-.7-.5-.9l-5.2-3.1-2.4-6.1c-.15-.4-.55-.7-1-.7s-.85.3-1 .7l-2.4 6.1L4.3 9.7C4 9.9 3.8 10.2 3.8 10.6s.2.7.5.9l5.2 3.1.6 3.5-1.4 1.1c-.2.15-.3.4-.3.65v.85c0 .3.25.5.55.45L11 20.9l1.7.55c.3.1.6-.1.6-.45v-.85c0-.25-.1-.5-.3-.65l-1.4-1.1.6-3.5 5.2-3.1z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Label */}
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700/70 dark:text-sky-400/70 animate-fade-in-out">
                {label}
            </p>

            <style>{`
        @keyframes fly {
          0%   { left: -10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        .animate-fly {
          /* ~2.6s flight, then a small pause before looping */
          animation: fly 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes bob {
          0%, 100% { transform: translateY(-4px) rotate(-2deg); }
          50%      { transform: translateY(4px)  rotate(2deg); }
        }
        .animate-bob {
          animation: bob 1.2s ease-in-out infinite;
        }

        @keyframes trail {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 1; }
        }
        .animate-trail {
          animation: trail 3s ease-in-out infinite;
        }

        @keyframes fade-in-out {
          0%, 100% { opacity: 0; transform: translateY(4px); }
          30%, 70% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 10s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}