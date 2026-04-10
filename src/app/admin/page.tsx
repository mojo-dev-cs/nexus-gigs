"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { getAllNexusUsers, verifyUserNode, terminateUserNode } from "./_actions/users"; 
import { 
  Shield, Users, DollarSign, Activity, 
  Search, Lock, Zap, BarChart, 
  TrendingUp, RefreshCw, X, Menu, Terminal,
  Globe, Eye, MousePointer2, AlertCircle
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
  const { user, isLoaded } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [nodes, setNodes] = useState<NexusNode[]>([]);
  const [totalTraffic, setTotalTraffic] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [loginError, setLoginError] = useState("");

  // --- 📈 REAL-TIME DATA MATRIX ---
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
      liveSessions: Math.floor(nodes.length * 0.12) + 2 
    };
  }, [nodes]);

  const syncRegistry = useCallback(async () => {
    setIsFetching(true);
    const res = await getAllNexusUsers();
    if (res.success && res.users) {
      setNodes(res.users as NexusNode[]);
      if (res.totalCount) setTotalTraffic(res.totalCount);
    }
    setIsFetching(false);
  }, []);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const authorizedEmail = "support.nexusgigs@gmail.com";
    const currentEmail = user?.primaryEmailAddress?.emailAddress;

    // Verify both Email Identity and Protocol Key
    if (currentEmail !== authorizedEmail) {
      setLoginError("UNAUTHORIZED IDENTITY DETECTED");
      return;
    }

    if (passInput === "Nexus123!") {
      sessionStorage.setItem("nexus_admin_session", "true");
      setIsAuthorized(true);
      setLoginError("");
    } else {
      setLoginError("INVALID PROTOCOL KEY");
    }
  };

  const handleCommand = async (actionFn: Function, id: string) => {
    if (confirm("EXECUTE SYSTEM COMMAND?")) {
      setIsFetching(true);
      const res = await actionFn(id);
      if (res.success) await syncRegistry();
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      syncRegistry();
      const heartbeat = setInterval(syncRegistry, 10000); 
      return () => clearInterval(heartbeat);
    }
  }, [isAuthorized, syncRegistry]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-black border border-red-500/20 p-10 rounded-[40px] text-center shadow-3xl">
          <Lock size={40} className="mx-auto mb-6 text-red-500" />
          <h1 className="text-xl font-black italic text-white uppercase mb-2">NEXUS <span className="text-red-600">HQ</span></h1>
          <p className="text-[9px] text-gray-500 uppercase font-bold mb-8 tracking-widest">Restricted Access Console</p>
          
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] text-gray-400 font-bold mb-2">
               {isLoaded ? (user?.primaryEmailAddress?.emailAddress || "Guest Node") : "Loading..."}
            </div>
            <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-red-600 transition-all" />
            {loginError && <p className="text-red-500 text-[8px] font-black uppercase tracking-tighter animate-pulse">{loginError}</p>}
            <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Initialize</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-32 overflow-x-hidden">
      
      {/* MOBILE HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/60 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Shield className="text-red-600" size={18}/>
            <h2 className="font-black italic text-lg uppercase tracking-tighter text-white">Nexus<span className="text-red-600">HQ</span></h2>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">LIVE</span>
            </div>
            <button onClick={syncRegistry} className={`p-2 rounded-full bg-white/5 ${isFetching ? 'animate-spin text-[#00f2ff]' : 'text-gray-400'}`}>
               <RefreshCw size={16} />
            </button>
         </div>
      </header>

      <main className="p-6 pt-24 max-w-5xl mx-auto">
        
        {/* VIEW: SYSTEM PULSE */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              
              {/* CARD 1: REVENUE OVERVIEW */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white rounded-[40px] shadow-3xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 p-6 opacity-5 text-black group-hover:rotate-12 transition-transform"><DollarSign size={90}/></div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Vault Revenue</p>
                <h4 className="text-5xl font-black text-slate-950 tracking-tighter">KES {metrics.totalRevenue.toLocaleString()}</h4>
                <div className="flex items-center gap-2 mt-4">
                   <TrendingUp size={14} className="text-emerald-500" />
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Global Payout Readiness: 100%</span>
                </div>
              </motion.div>

              {/* CARD 2: DEDICATED SITE VISITS */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 bg-[#0a0f1e] border border-white/10 rounded-[40px] shadow-3xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 p-6 opacity-10 text-[#00f2ff] group-hover:scale-110 transition-transform"><Globe size={90}/></div>
                <div className="flex justify-between items-start relative z-10 mb-8">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Traffic Registry</p>
                      <h4 className="text-4xl font-black text-white tracking-tighter">{totalTraffic.toLocaleString()} <span className="text-xs text-gray-600 font-bold uppercase italic ml-2">Total Visits</span></h4>
                   </div>
                   <div className="p-3 bg-[#00f2ff]/10 rounded-2xl text-[#00f2ff] border border-[#00f2ff]/20 shadow-glow"><Eye size={20}/></div>
                </div>

                <div className="space-y-4 relative z-10">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-gray-400">Live Active Relay</span>
                      <span className="text-[10px] font-black text-emerald-500 italic">{metrics.liveSessions} Node Sessions</span>
                   </div>
                   <div className="flex gap-1.5 h-12 items-end">
                      {[40, 80, 50, 100, 70, 90, 60, 85, 45, 75].map((h, i) => (
                        <motion.div key={i} animate={{ height: [`${h * 0.5}%`, `${h}%`, `${h * 0.7}%`] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }} className="flex-1 bg-[#00f2ff]/20 rounded-t-sm border-t border-[#00f2ff]/40 shadow-[0_0_10px_rgba(0,242,255,0.1)]" />
                      ))}
                   </div>
                </div>
              </motion.div>

              {/* CARD 3: NODE STATS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/3 border border-white/10 p-6 rounded-[35px] relative group overflow-hidden">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Network Nodes</p>
                  <h4 className="text-2xl font-black text-white">{metrics.nodeCount}</h4>
                </div>
                <div className="bg-white/3 border border-white/10 p-6 rounded-[35px] relative group overflow-hidden">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Verified Hubs</p>
                  <h4 className="text-2xl font-black text-[#00f2ff]">{metrics.verifiedCount}</h4>
                </div>
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
                   <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="FILTER..." className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black text-white w-full outline-none focus:border-red-600 transition-all uppercase tracking-widest" />
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase())).map((node) => (
                  <motion.div key={node.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white/3 border border-white/5 rounded-[35px] relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center font-black text-white">{node.name.charAt(0)}</div>
                          <div>
                             <h4 className="text-sm font-black uppercase italic text-white leading-none">{node.name}</h4>
                             <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">{node.email}</p>
                          </div>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase border ${node.status === 'Verified' ? 'border-emerald-500 text-emerald-500' : 'border-red-600 text-red-600'}`}>{node.status}</span>
                    </div>
                    
                    <div className="bg-black/40 p-4 rounded-2xl mb-6 border border-white/5 flex justify-between items-center shadow-inner">
                       <span className="text-[8px] font-bold text-gray-500 uppercase">Paid Balance</span>
                       <p className="text-[12px] font-black text-[#00f2ff] italic">KES {node.paidBalance || 0}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => handleCommand(verifyUserNode, node.id)} className="py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase italic active:scale-95 transition-all">Verify Node</button>
                       <button onClick={() => handleCommand(terminateUserNode, node.id)} className="py-4 bg-red-600 text-white rounded-2xl text-[9px] font-black uppercase italic active:scale-95 transition-all">Kill Link</button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* MOBILE NAV DOCK */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md h-16 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
         <button onClick={() => setActiveTab("dashboard")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "dashboard" ? "text-red-600 scale-110" : "text-gray-500"}`}>
            <BarChart size={18}/>
            <span className="text-[7px] font-black uppercase tracking-widest">Pulse</span>
         </button>
         <button onClick={() => setActiveTab("nodes")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "nodes" ? "text-red-600 scale-110" : "text-gray-500"}`}>
            <Users size={18}/>
            <span className="text-[7px] font-black uppercase tracking-widest">Nodes</span>
         </button>
         <button onClick={syncRegistry} className="flex flex-col items-center gap-1 text-gray-500 active:scale-95 transition-all">
            <RefreshCw size={18} className={isFetching ? "animate-spin text-[#00f2ff]" : ""}/>
            <span className="text-[7px] font-black uppercase tracking-widest">Sync</span>
         </button>
      </nav>

      <style jsx global>{`
        .shadow-glow { box-shadow: 0 0 15px rgba(0, 242, 255, 0.2); }
      `}</style>
    </div>
  );
}