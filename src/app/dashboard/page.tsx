import { currentUser } from "@clerk/nextjs/server";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";
import mongoose from "mongoose";
import Job from "@/models/Job";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return <div>Please sign in</div>;

  const role = (user.publicMetadata?.role as "freelancer" | "client") || "freelancer";
  
  // Make sure your MONGODB_URI is set in .env.local
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }

  const jobsData = await Job.find(role === "freelancer" ? { status: "open" } : { clientClerkId: user.id }).lean();
  const jobs = JSON.parse(JSON.stringify(jobsData));

  return (
    <main className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto mb-12">
         <h1 className="text-3xl font-black uppercase tracking-tighter italic">
           NEXUS<span className="text-[#00f2ff]">DASHBOARD</span>
         </h1>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {role === "freelancer" ? (
          <FreelancerView jobs={jobs} />
        ) : (
          <ClientView jobs={jobs} />
        )}
      </div>
    </main>
  );
}