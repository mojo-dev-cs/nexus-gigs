"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllNexusUsers, verifyUserNode, terminateUserNode } from "./_actions/users"; 
import { 
  Shield, Users, DollarSign, Activity, 
  Search, Lock, Zap, BarChart, 
  TrendingUp, RefreshCw, X, Menu, Terminal
} from "lucide-react";

interface NexusNode {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  joined: string;
  createdAt: number;
  paidBalance: number;
  banned: boolean;
}

export default function AdminPage() {
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [nodes, setNodes] = useState<NexusNode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // --- 📈 REAL-TIME METRICS ---
  const metrics = useMemo(() => {
    const totalPaid = nodes.reduce((sum, n) => sum + (n.paidBalance || 0), 0);
    const verified = nodes.filter(n => n.status === "Verified").length;
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const todayRevenue = nodes
      .filter(n => n.createdAt >= startOfToday)
      .reduce((sum, n) => sum + (n.paidBalance || 0), 0);

    return {
      totalRevenue: totalPaid,
      todayRevenue: todayRevenue,
      nodeCount: nodes.length,
      verifiedCount: verified,
    };
  }, [nodes]);

  const syncRegistry = useCallback(async () => {
    setIsFetching(true);
    const res = await getAllNexusUsers();
    if (res.success && res.users) {
      setNodes(res.users as NexusNode[]);
    }
    setIsFetching(false);
  }, []);

  const handleCommand = async (actionFn: Function, id: string) => {
    if (confirm("EXECUTE SYSTEM COMMAND?")) {
      setIsFetching(true);
      const res = await actionFn(id);
      if (res.success) await syncRegistry();
      else alert("Error: " + res.message);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      syncRegistry();
      // REAL-TIME HEARTBEAT: Sync every 10 seconds for live data flow
      const heartbeat = setInterval(syncRegistry, 10000);
      return () => clearInterval(heartbeat);
    }
  }, [isAuthorized, syncRegistry]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-black border border-red-500/20 p-10 rounded-[40px] text-center shadow-2xl">
          <Lock size={40} className="mx-auto mb-6 text-red-500" />
          <h1 className="text-xl font-black italic text-white uppercase mb-6">NEXUS <span className="text-red-600">HQ</span></h1>
          <form onSubmit={(e) => { e.preventDefault(); if(passInput === "Nexus123!") { sessionStorage.setItem("nexus_admin_session", "true"); setIsAuthorized(true); } }} className="space-y-4">
            <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-red-600 transition-all" />
            <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Initialize</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-32">
      
      {/* MOBILE HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/60 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Shield className="text-red-600" size={18}/>
            <h2 className="font-black italic text-lg uppercase tracking-tighter">Nexus<span className="text-red-600">HQ</span></h2>
         </div>
         <button onClick={syncRegistry} className={`p-2 rounded-full bg-white/5 ${isFetching ? 'animate-spin text-[#00f2ff]' : 'text-gray-400'}`}>
            <RefreshCw size={16} />
         </button>
      </header>

      <main className="p-6 pt-24 max-w-5xl mx-auto">
        
        {/* VIEW: SYSTEM PULSE */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="space-y-1">
               <h3 className="text-3xl font-black uppercase italic tracking-tighter">System <span className="text-red-600">Pulse</span></h3>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time Node Monitoring Active</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[35px] shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 p-6 opacity-5 text-black group-hover:rotate-12 transition-transform"><DollarSign size={80}/></div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Vault Revenue</p>
                <h4 className="text-4xl font-black text-slate-950 tracking-tighter">KES {metrics.totalRevenue.toLocaleString()}</h4>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0f1e] border border-white/10 p-6 rounded-[30px]">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Active Nodes</p>
                  <h4 className="text-2xl font-black text-white tracking-tighter">{metrics.nodeCount}</h4>
                </div>
                <div className="bg-[#0a0f1e] border border-white/10 p-6 rounded-[30px]">
                  <p className="text-[8px] font-black text-red-500 uppercase mb-1">Today Inflow</p>
                  <h4 className="text-2xl font-black text-white tracking-tighter">KES {metrics.todayRevenue.toLocaleString()}</h4>
                </div>
              </div>

              <div className="p-8 bg-white/3 border border-white/5 rounded-[35px] flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Activity size={20}/></div>
                    <div>
                       <p className="text-xs font-black uppercase italic">System Health</p>
                       <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">All Relays Operational</p>
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-emerald-500">99.9%</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: NODE REGISTRY */}
        {activeTab === "nodes" && (
          <div className="space-y-6">
             <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Node <span className="text-red-600">Registry</span></h3>
                <div className="relative">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                   <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="SEARCH NODES..." className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black text-white w-full outline-none focus:border-red-600 transition-all uppercase tracking-widest" />
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase())).map((node) => (
                  <motion.div key={node.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white/3 border border-white/5 rounded-[30px] relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-white">{node.name.charAt(0)}</div>
                          <div>
                             <h4 className="text-sm font-black uppercase italic text-white leading-none">{node.name}</h4>
                             <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">{node.email}</p>
                          </div>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase border ${node.status === 'Verified' ? 'border-emerald-500 text-emerald-500' : 'border-red-600 text-red-600'}`}>{node.status}</span>
                    </div>
                    
                    <div className="bg-black/40 p-4 rounded-2xl mb-4 border border-white/5">
                       <p className="text-[10px] font-black text-[#00f2ff] italic uppercase">Sync Balance: KES {node.paidBalance || 0}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => handleCommand(verifyUserNode, node.id)} className="py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase italic active:scale-95 transition-all">Verify</button>
                       <button onClick={() => handleCommand(terminateUserNode, node.id)} className="py-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase italic active:scale-95 transition-all">Kill</button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-around px-6 shadow-2xl">
         <button onClick={() => setActiveTab("dashboard")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "dashboard" ? "text-red-600 scale-110" : "text-gray-500"}`}>
            <BarChart size={20}/>
            <span className="text-[7px] font-black uppercase">Pulse</span>
         </button>
         <button onClick={() => setActiveTab("nodes")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "nodes" ? "text-red-600 scale-110" : "text-gray-500"}`}>
            <Users size={20}/>
            <span className="text-[7px] font-black uppercase">Nodes</span>
         </button>
         <button onClick={() => setActiveTab("config")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "config" ? "text-red-600 scale-110" : "text-gray-500"}`}>
            <Terminal size={20}/>
            <span className="text-[7px] font-black uppercase">Config</span>
         </button>
      </nav>
    </div>
  );
}