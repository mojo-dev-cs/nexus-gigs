"use client";

import { useSession } from "@clerk/nextjs"; // Add this import
import { useState } from "react";
import { completeOnboarding } from "./_actions";

export default function OnboardingPage() {
  const { session } = useSession(); // Get the session object
  const [loading, setLoading] = useState(false);

  const handleSelection = async (selectedRole: "freelancer" | "client") => {
    setLoading(true);

    try {
      const res = await completeOnboarding(selectedRole);
      
      if (res?.success) {
        // CRITICAL: Force Clerk to refresh the session token
        await session?.reload(); 
        
        // Now redirect
        window.location.assign("/dashboard");
      } else {
        setLoading(false);
        alert("Server Error: " + res?.error);
      }
    } catch (error) {
      setLoading(false);
      alert("Network Error: " + error);
    }
  };

  // ... rest of your return code ...
}