"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllNexusUsers, verifyUserNode, terminateUserNode } from "./_actions/users"; 
import { 
  Shield, Users, DollarSign, Activity, 
  Search, Lock, Zap, BarChart, 
  TrendingUp, RefreshCw, X, Menu, Terminal,
  Globe, Eye, MousePointer2, Mail, CreditCard, Smartphone,
  CheckCircle, AlertCircle, Clock
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
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [nodes, setNodes] = useState<NexusNode[]>([]);
  const [totalTraffic, setTotalTraffic] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [loginError, setLoginError] = useState("");

  // --- 📈 REAL-TIME DATA MATRIX (KES 1,300 Sync) ---
  const metrics = useMemo(() => {
    // Total Revenue is the sum of all 'paidBalance' fields in the DB
    const totalRevenue = nodes.reduce((sum, n) => sum + (n.paidBalance || 0), 0);
    const verifiedCount = nodes.filter(n => n.status === "Verified").length;
    const pendingCount = nodes.filter(n => n.status === "Pending").length;
    
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const todayRevenue = nodes
      .filter(n => n.createdAt >= startOfToday)
      .reduce((sum, n) => sum + (n.paidBalance || 0), 0);

    return {
      totalRevenue,
      todayRevenue,
      nodeCount: nodes.length,
      verifiedCount,
      pendingCount,
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
    if (emailInput === "support.nexusgigs@gmail.com" && passInput === "Nexus123!") {
      sessionStorage.setItem("nexus_admin_session", "true");
      setIsAuthorized(true);
      setLoginError("");
    } else {
      setLoginError("WRONG EMAIL OR PROTOCOL KEY");
    }
  };

  const handleCommand = async (actionFn: Function, id: string, label: string) => {
    if (confirm(`Do you want to ${label.toUpperCase()} this user?`)) {
      setIsFetching(true);
      const res = await actionFn(id);
      if (res.success) await syncRegistry();
      else alert("System Error: Command failed.");
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
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-black border border-red-500/20 p-12 rounded-[50px] text-center shadow-3xl">
          <Shield size={50} className="mx-auto mb-8 text-red-500" />
          <h1 className="text-2xl font-black italic text-white uppercase mb-2 leading-none">NEXUS <span className="text-red-600">HQ</span></h1>
          <p className="text-[10px] text-gray-600 uppercase font-bold tracking-[0.3em] mb-10">Admin Access Only</p>
          
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="ADMIN EMAIL" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-xs font-bold outline-none focus:border-white transition-all" required />
            <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-xs font-bold outline-none focus:border-red-600 transition-all" required />
            {loginError && <p className="text-red-500 text-[9px] font-black uppercase italic animate-pulse">{loginError}</p>}
            <button className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-lg">Authenticate</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-32 overflow-x-hidden text-sm">
      
      {/* 🌌 NEXUS BACKGROUND EFFECT */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-125 h-125 bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/60 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center shadow-xl">
         <div className="flex items-center gap-2">
            <Shield className="text-red-600" size={20}/>
            <h2 className="font-black italic text-xl uppercase tracking-tighter text-white leading-none">Nexus<span className="text-red-600">HQ</span></h2>
         </div>
         <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end leading-none">
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Relay Active</span>
               <span className="text-[10px] font-bold text-white italic">{metrics.liveSessions} Node Connections</span>
            </div>
            <button onClick={syncRegistry} className={`p-3 rounded-full bg-white/5 ${isFetching ? 'animate-spin text-[#00f2ff]' : 'text-gray-400'} shadow-inner`}>
               <RefreshCw size={18} />
            </button>
         </div>
      </header>

      <main className="p-6 pt-28 max-w-5xl mx-auto relative z-10">
        
        {/* --- TAB: DASHBOARD --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              
              {/* TOTAL REVENUE (KES 1,300 SYNC) */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-white rounded-[50px] shadow-3xl relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 p-8 opacity-5 text-black group-hover:rotate-12 transition-transform duration-700"><DollarSign size={120}/></div>
                <div className="flex justify-between items-start mb-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Vault Revenue (KES 1,300 Rate)</p>
                   <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full"><TrendingUp size={14} className="text-emerald-500" /><span className="text-[9px] font-black text-emerald-600 uppercase">Synced</span></div>
                </div>
                <h4 className="text-6xl font-black text-slate-950 tracking-tighter leading-none mb-6">KES {metrics.totalRevenue.toLocaleString()}.00</h4>
                <div className="flex gap-3">
                   <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl uppercase tracking-widest">Today: +{metrics.todayRevenue.toLocaleString()}</span>
                </div>
              </motion.div>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div className="bg-[#0a0f1e] border border-white/10 p-8 rounded-[40px] text-center">
                   <p className="text-[9px] font-black text-gray-500 uppercase mb-2 tracking-widest leading-none">Total Nodes</p>
                   <h4 className="text-3xl font-black text-white leading-none">{metrics.nodeCount}</h4>
                </div>
                <div className="bg-[#0a0f1e] border border-white/10 p-8 rounded-[40px] text-center">
                   <p className="text-[9px] font-black text-amber-500 uppercase mb-2 tracking-widest leading-none">Need Review</p>
                   <h4 className="text-3xl font-black text-white leading-none">{metrics.pendingCount}</h4>
                </div>
                <div className="bg-[#0a0f1e] border border-white/10 p-8 rounded-[40px] text-center col-span-2 md:col-span-1">
                   <p className="text-[9px] font-black text-[#00f2ff] uppercase mb-2 tracking-widest leading-none">Total Visits</p>
                   <h4 className="text-3xl font-black text-white leading-none">{totalTraffic.toLocaleString()}</h4>
                </div>
              </div>

              {/* TRAFFIC MONITOR */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-10 bg-[#0a0f1e] border-2 border-white/10 rounded-[50px] shadow-3xl relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 p-8 opacity-10 text-[#00f2ff] group-hover:scale-110 transition-transform duration-700"><Globe size={110}/></div>
                <div className="flex justify-between items-start relative z-10 mb-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Real-time Pulse</p>
                      <h4 className="text-4xl font-black text-white tracking-tighter italic">Live Data Flow</h4>
                   </div>
                   <div className="p-4 bg-[#00f2ff]/10 rounded-2xl text-[#00f2ff] border border-[#00f2ff]/20 shadow-glow"><Activity size={24}/></div>
                </div>
                <div className="flex gap-2 h-16 items-end relative z-10">
                   {[30, 60, 40, 90, 50, 100, 70, 85, 45, 65, 80, 50].map((h, i) => (
                     <motion.div key={i} animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.6}%`] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }} className="flex-1 bg-[#00f2ff]/20 rounded-t-sm border-t border-[#00f2ff]/40 shadow-[0_0_15px_rgba(0,242,255,0.15)]" />
                   ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* --- TAB: NODE REGISTRY --- */}
        {activeTab === "nodes" && (
          <div className="space-y-8">
             <div className="space-y-6 px-2">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Node <span className="text-red-600">Review</span></h3>
                <div className="relative">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                   <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="SCAN NODE IDENTITY..." className="bg-white/5 border border-white/10 rounded-[25px] pl-16 pr-8 py-5 text-[11px] font-black text-white w-full outline-none focus:border-red-600 transition-all uppercase tracking-widest shadow-inner" />
                </div>
             </div>

             <div className="grid grid-cols-1 gap-5">
                {nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase())).map((node) => (
                  <motion.div key={node.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-white/3 border border-white/5 rounded-[45px] relative overflow-hidden group shadow-2xl">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                       <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[25px] bg-red-600 flex items-center justify-center font-black text-2xl text-white shadow-lg group-hover:rotate-6 transition-transform">{node.name.charAt(0)}</div>
                          <div>
                             <h4 className="text-lg font-black uppercase italic text-white leading-none mb-1">{node.name}</h4>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{node.email}</p>
                             <p className="text-[9px] text-gray-600 font-black mt-2">ID: {node.id.toUpperCase()}</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border shadow-lg ${node.status === 'Verified' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : node.status === 'Pending' ? 'border-amber-500 text-amber-500 bg-amber-500/5 animate-pulse' : 'border-red-600 text-red-600 bg-red-600/5'}`}>{node.status}</span>
                          <span className="text-[8px] font-black text-gray-600 uppercase italic">Joined: {node.joined}</span>
                       </div>
                    </div>
                    
                    <div className="bg-black p-6 rounded-3xl mb-8 border border-white/5 flex justify-between items-center shadow-inner relative z-10">
                       <div className="flex items-center gap-3">
                          <CreditCard size={16} className="text-gray-500" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Paid Handshake Asset</span>
                       </div>
                       <p className="text-xl font-black text-[#00f2ff] italic leading-none">KES {node.paidBalance || 0}.00</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10 px-2">
                       <button onClick={() => handleCommand(verifyUserNode, node.id, "Approve")} className="py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase italic active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 tracking-widest"><CheckCircle size={14}/> Approve Node</button>
                       <button onClick={() => handleCommand(terminateUserNode, node.id, "Reject")} className="py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase italic active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 tracking-widest"><AlertCircle size={14}/> Terminate</button>
                    </div>

                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-700"><Terminal size={150}/></div>
                  </motion.div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* --- MOBILE NAV DOCK --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-md h-20 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-around px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
         <button onClick={() => setActiveTab("dashboard")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === "dashboard" ? 'text-red-600 scale-125' : 'text-gray-500 hover:text-white'}`}>
            <BarChart size={22}/>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Pulse</span>
         </button>
         <button onClick={() => setActiveTab("nodes")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === "nodes" ? 'text-red-600 scale-125' : 'text-gray-500 hover:text-white'}`}>
            <Users size={22}/>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Review</span>
         </button>
         <button onClick={syncRegistry} className="flex flex-col items-center gap-1.5 text-gray-500 hover:text-[#00f2ff] transition-all active:scale-90">
            <RefreshCw size={22} className={isFetching ? "animate-spin" : ""}/>
            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Sync</span>
         </button>
      </nav>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-glow { box-shadow: 0 0 20px rgba(0, 242, 255, 0.2); }
      `}</style>
    </div>
  );
}