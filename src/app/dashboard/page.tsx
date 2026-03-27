import { currentUser } from "@clerk/nextjs/server";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default async function DashboardPage() {
  const user = await currentUser();
  
  // Determine role from metadata (default to freelancer if not set)
  const role = user?.publicMetadata?.role || "freelancer";

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        {role === "freelancer" ? (
          <FreelancerView 
            jobs={[]} 
            userMetadata={user?.publicMetadata || {}} 
          />
        ) : (
          <ClientView jobs={[]} />
        )}
      </div>
    </main>
  );
}