"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const isAuth = sessionStorage.getItem("admin_auth") || localStorage.getItem("admin_auth_backup");
    const adminEmail = "mojojojjy@gmail.com"; 

    if (!isAuth) {
      window.location.href = "/admin-login";
    } else if (user?.emailAddresses[0].emailAddress.toLowerCase() !== adminEmail.toLowerCase()) {
      // If they have the password but NOT the right email, send to freelancer dash
      router.push("/dashboard");
    } else {
      setAuthenticated(true);
    }
  }, [user, isLoaded, router]);

  if (!authenticated || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Syncing Nexus HQ...</p>
      </div>
    );
  }

  const navModules = [
    { label: "Dashboard", icon: "📊", href: "/admin", desc: "Overview & Feed" },
    { label: "Users", icon: "👤", href: "/admin/users", desc: "Registry & KYC" },
    { label: "Payments", icon: "💰", href: "/admin/payments", desc: "M-Pesa & Fees" },
    { label: "Gigs & Jobs", icon: "💼", href: "/admin/gigs", desc: "Moderation" },
    { label: "Contracts", icon: "📜", href: "/admin/contracts", desc: "Milestones" },
    { label: "Disputes", icon: "⚖️", href: "/admin/disputes", desc: "Resolutions" },
    { label: "Analytics", icon: "📈", href: "/admin/analytics", desc: "Reports" },
    { label: "Marketing", icon: "📢", href: "/admin/marketing", desc: "Campaigns" },
    { label: "Settings", icon: "⚙️", href: "/admin/settings", desc: "Config" },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <aside className="w-72 border-r border-red-500/10 bg-black/40 backdrop-blur-3xl fixed h-full flex flex-col z-100 overflow-y-auto no-scrollbar">
        <div className="p-8">
          <h1 className="font-black italic text-red-500 uppercase tracking-tighter text-2xl">NEXUS <span className="text-white">HQ</span></h1>
        </div>
        <nav className="flex-1 px-4 pb-10 space-y-1">
          {navModules.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-start gap-4 px-6 py-4 rounded-3xl hover:bg-red-500/5 text-gray-500 hover:text-white transition-all group">
              <span className="text-xl mt-1">{item.icon}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                <span className="text-[7px] font-bold text-gray-600 mt-1 uppercase group-hover:text-red-500">{item.desc}</span>
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5 bg-black/20">
           <button onClick={() => { sessionStorage.clear(); localStorage.removeItem("admin_auth_backup"); window.location.href = "/admin-login"; }} className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[8px] font-black uppercase text-gray-500 hover:text-red-500 transition-all">Terminate Session</button>
        </div>
      </aside>
      <main className="flex-1 ml-72 p-12">{children}</main>
    </div>
  );
}