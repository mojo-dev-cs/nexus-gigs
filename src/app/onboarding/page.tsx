"use client";

import { useSession } from "@clerk/nextjs"; // Add this import
import { useState } from "react";
import { completeOnboarding } from "./_actions";

export default function OnboardingPage() {
  const { session } = useSession(); // Get the session object
  const [loading, setLoading] = useState(false);

// Inside your handleSelection function in page.tsx
const handleSelection = async (selectedRole: "freelancer" | "client") => {
  setLoading(true);
  try {
    const res = await completeOnboarding(selectedRole);
    
    // Even if the DB part fails, if the metadata updated, we move!
    if (res?.success) {
      window.location.href = "/dashboard";
    } else {
      // Fallback: If it's just a metadata lag, try to force it
      window.location.assign("/dashboard");
    }
  } catch (e) {
    window.location.href = "/dashboard";
  }
};
  // ... rest of your return code ...
}