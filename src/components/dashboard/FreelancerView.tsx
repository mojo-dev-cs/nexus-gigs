import Link from "next/link";

export const FreelancerView = () => (
  <div className="flex flex-col gap-8 w-full max-w-6xl">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white/5 border border-[#00f2ff]/20 rounded-2xl">
        <h3 className="text-[#00f2ff] font-bold uppercase text-xs tracking-widest">Active Gigs</h3>
        <p className="text-4xl font-black mt-2">0</p>
      </div>
      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest">Profile Status</h3>
        <p className="text-xl font-bold mt-2 text-yellow-500">Incomplete</p>
      </div>
      <Link href="/dashboard/profile" className="p-6 bg-[#00f2ff] text-black font-bold rounded-2xl flex items-center justify-center hover:scale-105 transition-all">
        Complete Profile
      </Link>
    </div>

    {/* Placeholder for Jobs */}
    <div className="w-full p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
      <p className="text-gray-500 font-medium">No jobs found for your skills yet.</p>
      <button className="mt-4 text-[#00f2ff] text-sm font-bold hover:underline">Browse Market →</button>
    </div>
  </div>
);