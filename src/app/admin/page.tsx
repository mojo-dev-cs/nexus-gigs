"use client";

export default function AdminOverview() {
  const stats = [
    { label: "Total Users", val: "1,240", change: "+12%", color: "text-white" },
    { label: "Active Freelancers", val: "842", change: "+5%", color: "text-emerald-500" },
    { label: "Total Revenue", val: "$12,450", change: "+$1.2k", color: "text-red-500" },
    { label: "Activation Fees", val: "$8,420", change: "842 Users", color: "text-[#00f2ff]" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Command <span className="text-red-500">Overview</span></h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">Real-time Platform Intelligence</p>
      </header>

      {/* --- 📊 STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-sm">
            <p className="text-[9px] font-black uppercase text-gray-500 mb-4 tracking-widest">{s.label}</p>
            <h3 className={`text-3xl font-black italic mb-2 ${s.color}`}>{s.val}</h3>
            <p className="text-[8px] font-bold uppercase text-emerald-500">{s.change} <span className="text-gray-600">vs last month</span></p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- 📈 REVENUE CHART (Mock) --- */}
        <div className="lg:col-span-2 p-10 bg-white/5 border border-white/10 rounded-[48px] space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest italic text-red-500">Revenue Velocity</h4>
          <div className="h-64 flex items-end gap-2">
            {[40, 70, 45, 90, 65, 80, 50, 100, 85, 45, 30, 60].map((h, i) => (
              <div key={i} className="flex-1 bg-red-500/20 rounded-t-xl hover:bg-red-500 transition-all cursor-pointer" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* --- ⚡ ACTIVITY FEED --- */}
        <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] space-y-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest italic text-red-500">Live Activity</h4>
          <div className="space-y-6">
            {[
              { act: "New User Registered", node: "Node-843", time: "2m ago" },
              { act: "Payment Initiated", node: "Node-124", time: "5m ago" },
              { act: "Gig Approved", node: "Job-992", time: "12m ago" },
              { act: "Dispute Opened", node: "Node-042", time: "1h ago" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase">{item.act}</p>
                  <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">{item.node}</p>
                </div>
                <span className="text-[7px] font-black text-red-500 uppercase">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}