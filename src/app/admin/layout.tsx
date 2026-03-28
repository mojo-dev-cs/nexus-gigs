"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // 🔒 Security Check: Password & Email Verification
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth");
    const adminEmail = "mojojojjy@gmail.com";

    if (!isAuth) {
      router.push("/admin/login");
    } else if (isLoaded && user?.emailAddresses[0].emailAddress !== adminEmail) {
      // Secondary check: Even with password, must be your email
      router.push("/dashboard");
    } else {
      setAuthenticated(true);
    }
  }, [user, isLoaded, router]);

  if (!authenticated || !isLoaded) return null;

  const menuItems = [
    { label: "Overview", icon: "📊", href: "/admin" },
    { label: "Users", icon: "👤", href: "/admin/users" },
    { label: "Payments", icon: "💰", href: "/admin/payments" },
    { label: "Gigs", icon: "💼", href: "/admin/gigs" },
    { label: "Disputes", icon: "⚖️", href: "/admin/disputes" },
    { label: "Marketing", icon: "📢", href: "/admin/marketing" },
    { label: "Settings", icon: "⚙️", href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-red-500/30">
      {/* --- 🛡️ SIDEBAR --- */}
      <aside className="w-64 border-r border-red-500/10 bg-black/40 backdrop-blur-xl fixed h-full flex flex-col z-100">
        <div className="p-8">
          <h1 className="font-black italic text-red-500 uppercase tracking-tighter text-2xl">
            NEXUS <span className="text-white">HQ</span>
          </h1>
          <p className="text-[8px] font-black text-gray-600 tracking-[0.2em] mt-1 uppercase">Command Center V1.0</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-red-500/5 text-gray-400 hover:text-red-500 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-black italic text-white text-xs border border-white/10">
              {user?.firstName?.[0]}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-tighter">{user?.firstName}</p>
              <p className="text-[7px] text-red-500 font-bold uppercase tracking-widest">Master Overseer</p>
            </div>
          </div>
          <SignOutButton>
            <button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-gray-500 hover:text-red-500 transition-all">
              Terminate Session
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* --- 🖥️ MAIN VIEWPORT --- */}
      <main className="flex-1 ml-64 p-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent">
        {children}
      </main>
    </div>
  );
}