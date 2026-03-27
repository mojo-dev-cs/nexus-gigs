import { currentUser } from "@clerk/nextjs/server";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

// We define this here so both the page and components are in sync
export interface Job {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
}

export default async function DashboardPage() {
  const user = await currentUser();
  
  // Safety check: if Clerk session fails
  if (!user) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Session Expired</h2>
          <a href="/sign-in" className="text-[#00f2ff] font-black hover:underline">RE-AUTHENTICATE →</a>
        </div>
      </main>
    );
  }

  // We use the role you manually set in Clerk Metadata
  const role = (user.publicMetadata?.role as "freelancer" | "client") || "freelancer";
  
  // For now, we pass an empty array of Jobs
  const jobs: Job[] = []; 

  return (
    <main className="min-h-screen bg-[#020617] text-white p-8">
      {/* Dashboard Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
            NEXUS<span className="text-[#00f2ff]">DASHBOARD</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">
            Global Talent Ecosystem v1.0
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-gray-500 uppercase">Operating as</span>
             <span className="text-xs font-bold bg-[#00f2ff]/10 text-[#00f2ff] px-4 py-1 rounded-full uppercase tracking-widest border border-[#00f2ff]/20">
               {role}
             </span>
           </div>
        </div>
      </div>

      {/* Render the correct view based on role */}
      <div className="max-w-6xl mx-auto">
        {role === "freelancer" ? (
          <FreelancerView jobs={jobs} />
        ) : (
          <ClientView />
        )}
      </div>
    </main>
  );
}