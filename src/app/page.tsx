"use client";

import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import HeroScene from "../components/3d/HeroScene";

export default function LandingPage() {
  const { userId } = useAuth(); 

  return (
    <main className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-4">
      
      {/* 1. 3D Scene Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <HeroScene />
      </div>

      {/* 2. Top Navigation */}
      <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-20 max-w-7xl">
        <div className="text-2xl font-black tracking-tighter">
          NEXUS<span className="text-[#00f2ff]">GIGS</span>
        </div>
        <div className="flex items-center gap-6">
          {!userId ? (
            <SignUpButton mode="modal">
              <button className="text-sm font-medium hover:text-[#00f2ff] transition-colors cursor-pointer bg-transparent border-none outline-none">
                Sign In
              </button>
            </SignUpButton>
          ) : (
            <Link href="/dashboard" className="text-sm font-medium hover:text-[#00f2ff] transition-colors">
              My Account
            </Link>
          )}
        </div>
      </nav>

      {/* 3. Hero Content Layer */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-5xl">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none select-none">
            NEXUS<span className="text-[#00f2ff] drop-shadow-[0_0_20px_rgba(0,242,255,0.6)]">GIGS</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto">
            Where Talent Meets Opportunity in a 3D Immersive Marketplace designed for Kenya.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 pt-4">
          {!userId ? (
            <SignUpButton mode="modal">
              <button className="group relative px-10 py-4 bg-[#00f2ff] text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,242,255,0.4)] cursor-pointer">
                Get Started
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            </SignUpButton>
          ) : (
            <Link href="/dashboard">
              <button className="px-10 py-4 bg-[#00f2ff] text-black font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,242,255,0.4)]">
                Go to Dashboard
              </button>
            </Link>
          )}
          
          <button className="px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-white/20">
            Browse Jobs
          </button>
        </div>
      </div>

      {/* 4. Footer Branding */}
      <div className="absolute bottom-8 z-10 text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium">
        Powering the Kenyan Digital Economy
      </div>
      
    </main>
  );
}