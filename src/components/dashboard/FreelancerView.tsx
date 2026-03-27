// ADD THE WORD 'export' HERE
export const FreelancerView = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
    <div className="p-6 bg-white/5 border border-[#00f2ff]/20 rounded-2xl">
      <h3 className="text-[#00f2ff] font-bold">Active Gigs</h3>
      <p className="text-3xl font-black text-white">0</p>
    </div>
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
      <h3 className="text-gray-400 font-bold">Total Earned</h3>
      <p className="text-3xl font-black text-white">$0.00</p>
    </div>
    <button className="p-6 bg-[#00f2ff] text-black font-bold rounded-2xl hover:scale-105 transition-all cursor-pointer">
      Find New Work
    </button>
  </div>
);