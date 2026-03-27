"use client"; // Add this since we are using interactive components

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 px-10 py-6 flex justify-between items-center backdrop-blur-xl bg-[#020617]/80 border-b border-white/5">
      <Link href="/" className="group">
        <h1 className="text-xl font-black uppercase italic tracking-tighter transition-all group-hover:tracking-normal">
          NEXUS<span className="text-[#00f2ff] group-hover:text-white transition-colors">GIGS</span>
        </h1>
      </Link>
      
      <div className="flex items-center gap-8 font-black uppercase text-[10px] tracking-[0.2em] text-gray-400">
        <Link href="/dashboard" className="hover:text-white transition-colors cursor-pointer">Intelligence</Link>
        <Link href="/dashboard" className="hover:text-white transition-colors cursor-pointer">Missions</Link>
        
        <div className="h-4 w-px bg-white/10" />
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-gray-600">Secure Protocol</span>
          <UserButton 
            appearance={{ 
              elements: { 
                userButtonAvatarBox: "w-9 h-9 rounded-2xl border border-white/10 hover:border-[#00f2ff]/50 transition-all" 
              } 
            }} 
          />
        </div>
      </div>
    </nav>
  );
};