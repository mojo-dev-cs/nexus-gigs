"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // Timer to show a retry button if it hangs too long
    const timer = setTimeout(() => setShowRetry(true), 5000);

    const isAuth = sessionStorage.getItem("admin_auth");
    // Ensure this matches your Clerk email EXACTLY (case-sensitive)
    const adminEmail = "mojojojjy@gmail.com"; 

    if (!isAuth) {
      router.push("/admin/login");
    } else if (user?.emailAddresses[0].emailAddress.toLowerCase() !== adminEmail.toLowerCase()) {
      // Added .toLowerCase() to prevent casing errors
      console.log("Access Denied for:", user?.emailAddresses[0].emailAddress);
      router.push("/dashboard");
    } else {
      setAuthenticated(true);
      setChecking(false);
    }

    return () => clearTimeout(timer);
  }, [user, isLoaded, router]);

  if (checking || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-red-500 animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 animate-pulse">
          Authenticating Nexus HQ
        </p>
        
        {showRetry && (
          <div className="mt-8 space-y-4 text-center animate-in fade-in duration-1000">
            <p className="text-[9px] text-gray-500 uppercase font-bold">Taking too long?</p>
            <button 
              onClick={() => { sessionStorage.clear(); window.location.reload(); }}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white"
            >
              Reset Session & Retry
            </button>
          </div>
        )}
      </div>
    );
  }

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
    <div className="flex min-h-screen bg-[#020617] text-white">
      <aside className="w-64 border-r border-red-500/10 bg-black/40 backdrop-blur-xl fixed h-full flex flex-col z-100">
        <div className="p-8">
          <h1 className="font-black italic text-red-500 uppercase tracking-tighter text-2xl">
            NEXUS <span className="text-white">HQ</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 hover:text-red-500 transition-all">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <SignOutButton><button className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-gray-500">Terminate</button></SignOutButton>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-10">{children}</main>
    </div>
  );
}