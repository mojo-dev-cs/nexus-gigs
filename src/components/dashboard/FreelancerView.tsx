"use client";

export const FreelancerView = ({ jobs }: { jobs: any[] }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Search & Filter Bar */}
      <div className="p-2 bg-white/5 border border-white/10 rounded-[24px] flex flex-col md:flex-row gap-2">
        <input 
          type="text" 
          placeholder="SEARCH THE NEXUS..." 
          className="flex-1 bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-widest outline-none placeholder:text-gray-700"
        />
        <div className="flex gap-2">
          <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none">
            <option>All Categories</option>
            <option>Web Dev</option>
            <option>Design</option>
          </select>
          <button className="bg-[#00f2ff] text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-tighter">Filter</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">
          Available <span className="text-[#00f2ff]">Missions</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Feed</span>
        </div>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
             <div key={job._id} className="group relative p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[40px] hover:border-[#00f2ff]/50 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black bg-[#00f2ff]/10 text-[#00f2ff] px-3 py-1 rounded-full border border-[#00f2ff]/20 uppercase tracking-widest">
                    {job.category}
                  </span>
                  <p className="text-2xl font-black italic tracking-tighter">${job.budget}</p>
                </div>
                <h3 className="text-xl font-bold group-hover:text-[#00f2ff] transition-colors duration-300">{job.title}</h3>
                <p className="text-gray-500 text-sm mt-3 line-clamp-2 font-medium">{job.description}</p>
                
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-[#020617]" />)}
                    <span className="pl-4 text-[10px] font-bold text-gray-600 uppercase self-center">+12 Applicants</span>
                  </div>
                  <button className="px-6 py-2 bg-white text-black font-black text-[10px] rounded-full uppercase hover:bg-[#00f2ff] transition-colors">
                    View Details
                  </button>
                </div>
             </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[48px] text-center">
          <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Scanning Global Frequencies...</h3>
          <p className="text-gray-600 text-xs mt-2 uppercase font-black">Waiting for visionaries to deploy missions</p>
        </div>
      )}
    </div>
  );
};