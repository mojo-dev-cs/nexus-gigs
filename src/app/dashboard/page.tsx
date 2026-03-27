import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const role = user.publicMetadata?.role as "freelancer" | "client";

  return (
    <main className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          NEXUS<span className={role === "freelancer" ? "text-[#00f2ff]" : "text-purple-500"}>
            {role === "freelancer" ? "TALENT" : "VISIONARY"}
          </span>
        </h1>
        <div className="text-[10px] font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest">
          Status: Online
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {role === "freelancer" ? (
          <FreelancerView jobs={[]} /> 
        ) : (
          <ClientView jobs={[]} />
        )}
      </div>
    </main>
  );
}