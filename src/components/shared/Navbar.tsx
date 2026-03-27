"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 px-6 md:px-12 py-5 flex justify-between items-center backdrop-blur-2xl bg-[#020617]/80 border-b border-white/5">
      <Link href="/" className="group flex items-center gap-2">
        <div className="w-8 h-8 bg-[#00f2ff] rounded-lg rotate-45 flex items-center justify-center">
            <div className="-rotate-45 font-black text-black text-xs">N</div>
        </div>
        <h1 className="text-xl font-black uppercase italic tracking-tighter">
          NEXUS<span className="text-[#00f2ff]">GIGS</span>
        </h1>
      </Link>
      
      <div className="flex items-center gap-4">
        {/* Verification Status Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Unverified Account</span>
        </div>

        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-xl" } }} />
        </div>
      </div>
    </nav>
  );
};