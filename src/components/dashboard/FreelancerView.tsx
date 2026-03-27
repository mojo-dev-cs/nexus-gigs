import { Job } from "@/app/dashboard/page";

interface FreelancerProps {
  jobs: Job[];
}

export const FreelancerView = ({ jobs }: FreelancerProps) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
          Available <span className="text-[#00f2ff]">Missions</span>
        </h2>
        <div className="h-0.5 flex-1 bg-linear-to-r from-[#00f2ff]/50 to-transparent ml-8 hidden md:block" />
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-[#00f2ff]/40 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black text-[#00f2ff] uppercase tracking-widest bg-[#00f2ff]/10 px-3 py-1 rounded-full border border-[#00f2ff]/20">
                    {job.category}
                  </span>
                  <h3 className="text-xl font-bold mt-3 group-hover:text-[#00f2ff] transition-colors">
                    {job.title}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">${job.budget}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Fixed Budget</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl line-clamp-2">
                {job.description}
              </p>
              
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Post Date: Just Now</span>
                <button className="text-xs font-black text-black bg-[#00f2ff] px-6 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all">
                  INITIATE PROPOSAL
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
          </div>
          <h3 className="text-lg font-bold text-gray-300">Scanning the Nexus for Gigs...</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-xs font-medium">
            No missions match your current global standing. Check back shortly.
          </p>
        </div>
      )}
    </div>
  );
};