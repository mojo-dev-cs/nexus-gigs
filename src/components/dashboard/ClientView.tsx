export const ClientView = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
    <div className="p-6 bg-white/5 border border-purple-500/20 rounded-2xl">
      <h3 className="text-purple-400 font-bold">Open Jobs</h3>
      <p className="text-3xl font-black">0</p>
    </div>
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
      <h3 className="text-gray-400 font-bold">Total Spent</h3>
      <p className="text-3xl font-black">$0.00</p>
    </div>
    <button className="p-6 bg-purple-500 text-white font-bold rounded-2xl">Post a Gig</button>
  </div>
);