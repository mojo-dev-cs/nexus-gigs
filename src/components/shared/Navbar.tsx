"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 px-6 md:px-12 py-5 flex justify-between items-center backdrop-blur-2xl bg-[#020617]/80 border-b border-white/5">
      <Link href="/" className="group flex items-center gap-2">
        <div className="w-8 h-8 bg-[#00f2ff] rounded-lg rotate-45 group-hover:rotate-90 transition-all duration-500 flex items-center justify-center">
            <div className="-rotate-45 group-hover:-rotate-90 transition-all duration-500 font-black text-black text-xs">N</div>
        </div>
        <h1 className="text-xl font-black uppercase italic tracking-tighter hidden sm:block">
          NEXUS<span className="text-[#00f2ff]">GIGS</span>
        </h1>
      </Link>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 font-black uppercase text-[9px] tracking-[0.3em] text-gray-500">
          <Link href="/dashboard" className="hover:text-[#00f2ff] transition-colors">Intelligence</Link>
          <Link href="/dashboard" className="hover:text-[#00f2ff] transition-colors">Marketplace</Link>
          <div className="h-4 w-px bg-white/10" />
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">System Active</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Encrypted Port</span>
          </div>
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-xl" } }} />
        </div>
      </div>
    </nav>
  );
};