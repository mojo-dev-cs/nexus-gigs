"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // If already signed in, kick them to the dashboard automatically
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null; // Brief silence while Clerk loads

  return (
    <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase">
          NEXUS <span className="text-[#00f2ff]">GIGS</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed uppercase tracking-widest">
          The Premier Mission Relay for High-Fidelity Freelancing.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/sign-up" className="px-10 py-4 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,242,255,0.3)]">
            Initialize Node
          </Link>
          <Link href="/sign-in" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all">
            Access Protocol
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-[8px] font-black text-gray-600 uppercase tracking-[0.5em]">
        © 2026 NEXUS CORE INFRASTRUCTURE
      </footer>
    </main>
  );
}