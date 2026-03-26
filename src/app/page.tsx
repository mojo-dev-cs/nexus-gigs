"use client";

import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import HeroScene from "../components/3d/HeroScene";

export default function LandingPage() {
  const { userId } = useAuth(); 

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#020617] text-white flex flex-col items-center justify-center">
      
      {/* 1. 3D Scene Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <HeroScene />
      </div>

      {/* 2. Top Navigation */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20 max-w-7xl mx-auto">
        <div className="text-xl md:text-2xl font-black tracking-tighter">
          NEXUS<span className="text-nexusBlue">GIGS</span>
        </div>
        <div className="flex items-center gap-6">
          {!userId ? (
            <SignUpButton mode="modal">
              <button className="text-sm font-medium hover:text-nexusBlue transition-colors cursor-pointer bg-transparent border-none">
                Sign In
              </button>
            </SignUpButton>
          ) : (
            <Link href="/dashboard" className="text-sm font-medium hover:text-nexusBlue transition-colors">
              My Account
            </Link>
          )}
        </div>
      </nav>

      {/* 3. Hero Content Layer */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8 px-4 max-w-4xl mt-[-50px]">
        <div className="space-y-2 md:space-y-4">
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-tight select-none text-white">
            NEXUS<span className="text-nexusBlue drop-shadow-[0_0_20px_rgba(0,242,255,0.6)]">GIGS</span>
          </h1>
          <p className="text-gray-300 text-base md:text-xl lg:text-2xl font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
            Where Talent Meets Opportunity in a 3D Immersive Marketplace designed for Kenya.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {!userId ? (
            <SignUpButton mode="modal">
              <button className="group relative px-8 py-3 md:px-10 md:py-4 bg-nexusBlue text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,242,255,0.4)] cursor-pointer border-none">
                Get Started
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            </SignUpButton>
          ) : (
            <Link href="/dashboard">
              <button className="px-8 py-3 md:px-10 md:py-4 bg-nexusBlue text-black font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,242,255,0.4)] border-none">
                Go to Dashboard
              </button>
            </Link>
          )}
          
          <button className="px-8 py-3 md:px-10 md:py-4 bg-transparent border border-white/20 text-white font-bold rounded-full transition-all hover:bg-white/10">
            Browse Jobs
          </button>
        </div>
      </div>

      {/* 4. Footer Branding */}
      <div className="absolute bottom-6 z-10 text-[10px] md:text-xs tracking-[0.2em] text-gray-500 uppercase font-medium">
        Powering the Kenyan Digital Economy
      </div>
      
    </main>
  );
}