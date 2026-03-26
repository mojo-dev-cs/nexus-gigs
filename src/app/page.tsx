"use client";

import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import HeroScene from "../components/3d/HeroScene";

export default function LandingPage() {
  const { userId } = useAuth(); 

  return (
    <main className="relative w-full h-screen bg-[#020617] overflow-hidden">
      
      {/* 1. 3D Scene Layer - Fixed Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <HeroScene />
      </div>

      {/* 2. Top Navigation - Forced to Front */}
      <nav className="relative z-50 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-white">
          NEXUS<span className="text-[#00f2ff]">GIGS</span>
        </div>
        <div className="flex items-center gap-6">
          {!userId ? (
            <SignUpButton mode="modal">
              <button className="text-sm font-bold text-white hover:text-[#00f2ff] transition-colors cursor-pointer border-none bg-transparent">
                Sign In
              </button>
            </SignUpButton>
          ) : (
            <Link href="/dashboard" className="text-sm font-bold text-[#00f2ff]">
              Account
            </Link>
          )}
        </div>
      </nav>

      {/* 3. Hero Content - Center Stage */}
      <div className="relative z-50 flex h-[calc(100vh-100px)] flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white drop-shadow-2xl">
            NEXUS<span className="text-[#00f2ff]">GIGS</span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            The future of freelancing in <span className="text-white border-b-2 border-[#00f2ff]">Kenya</span>. 
            Immersive. Secure. Decentralized.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            {!userId ? (
              <SignUpButton mode="modal">
                <button className="px-10 py-4 bg-[#00f2ff] text-black font-extrabold rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(0,242,255,0.4)] border-none cursor-pointer">
                  GET STARTED
                </button>
              </SignUpButton>
            ) : (
              <Link href="/dashboard">
                <button className="px-10 py-4 bg-[#00f2ff] text-black font-extrabold rounded-full shadow-[0_0_40px_rgba(0,242,255,0.4)]">
                  DASHBOARD
                </button>
              </Link>
            )}
            
            <button className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all">
              BROWSE JOBS
            </button>
          </div>
        </div>
      </div>

      {/* 4. Footer Branding */}
      <div className="absolute bottom-8 w-full text-center z-50">
        <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase font-black">
          Built for Kenyatta University • 2026
        </p>
      </div>
      
    </main>
  );
}