import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  // If no user is logged in, send them back home
  if (!user) {
    redirect("/");
  }
  
  const role = user.publicMetadata?.role as string;

  return (
    <main className="min-h-screen bg-[#020617] text-white p-8 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-5xl font-black tracking-tighter">
          WELCOME, <span className="text-[#00f2ff] uppercase">{user.firstName}</span>
        </h1>
        
        <div className="p-6 bg-white/5 border border-[#00f2ff]/30 rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.1)]">
          <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">Current Role</p>
          <p className="text-2xl font-mono text-[#00f2ff]">
            {role ? role.toUpperCase() : "Onboarding Pending..."}
          </p>
        </div>
      </div>
    </main>
  );
}