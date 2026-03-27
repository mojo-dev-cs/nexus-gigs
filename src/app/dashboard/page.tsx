import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const role = user.publicMetadata?.role as "freelancer" | "client";

  return (
    <main className="min-h-screen bg-[#020617] text-white p-8 flex flex-col items-center">
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          NEXUS<span className="text-[#00f2ff]">DASH</span>
        </h1>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Logged in as</p>
          <p className="font-bold text-[#00f2ff]">{user.firstName}</p>
        </div>
      </header>

      <div className="w-full max-w-6xl mb-10">
        <h2 className="text-5xl font-black mb-2">
          {role === "freelancer" ? "Hustle Hard." : "Build Fast."}
        </h2>
        <p className="text-gray-400">Welcome to your specialized portal.</p>
      </div>

      {role === "freelancer" ? <FreelancerView /> : <ClientView />}
    </main>
  );
}