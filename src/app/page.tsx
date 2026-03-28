"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
// This path MUST match where you saved the file
import { FreelancerView } from "@/components/dashboard/FreelancerView";

export default function DashboardPage() {
  const { isLoaded, user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while Clerk or Component mounts
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