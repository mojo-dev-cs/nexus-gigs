"use client";

import { useUser } from "@clerk/nextjs";
// ✅ Fixed path: going up two levels to reach components/dashboard/
import { FreelancerView } from "@/components/dashboard/FreelancerView"; 
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { isLoaded, user } = useUser();
  const [mounted, setMounted] = useState(false);

  // Fixes hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="text-[#00f2ff] font-black animate-pulse uppercase tracking-[0.5em] text-[10px]">
          Synchronizing Node...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#020617]">
      <FreelancerView 
        jobs={[]} 
        userMetadata={user.publicMetadata || {}} 
      />
    </main>
  );
}