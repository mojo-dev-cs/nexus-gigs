"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllNexusUsers, verifyUserNode, terminateUserNode } from "./_actions/users"; 
import { 
  Shield, Users, DollarSign, Search, 
  BarChart, TrendingUp, RefreshCw, Terminal,
  CreditCard, Trash2, Ban, UserCheck, ShieldAlert,
  Globe, Eye, Clock, CheckCircle, AlertCircle, Mail
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

  // 🔥 FIXED: FORCE VERIFIED USERS = 1300 SYNC
  const getDisplayBalance = useCallback((node: NexusNode) => {
    return node.status === "Verified" ? 1300 : (node.paidBalance || 0);
  }, []);

  // --- 📈 REAL-TIME DATA MATRIX ---
  const metrics = useMemo(() => {
    const totalRevenue = nodes.reduce((sum, n) => sum + getDisplayBalance(n), 0);
    const verifiedCount = nodes.filter(n => n.status === "Verified").length;
    const pendingCount = nodes.filter(n => n.status === "Pending").length;
    const bannedCount = nodes.filter(n => n.banned).length;
    
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const todayRevenue = nodes
      .filter(n => n.createdAt >= startOfToday)
      .reduce((sum, n) => sum + getDisplayBalance(n), 0);

    return {
      totalRevenue,
      todayRevenue,
      nodeCount: nodes.length,
      verifiedCount,
      pendingCount,
      bannedCount,
      liveSessions: Math.floor(nodes.length * 0.12) + 2 
    };
  }, [nodes, getDisplayBalance]);

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
    if (confirm(`SYSTEM WARNING: Proceed with ${label.toUpperCase()} command?`)) {
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
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-sm">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-black border border-red-500/20 p-12 rounded-[45px] text-center shadow-3xl">
          <Shield size={45} className="mx-auto mb-6 text-red-500" />
          <h1 className="text-xl font-black italic text-white uppercase mb-2 leading-none">NEXUS <span className="text-red-600">HQ</span></h1>
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em] mb-8 leading-none">Admin Uplink</p>
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="ADMIN EMAIL" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs font-bold outline-none focus:border-white transition-all" required />
            <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs font-bold outline-none focus:border-red-600 transition-all" required />
            {loginError && <p className="text-red-500 text-[8px] font-black uppercase animate-pulse">{loginError}</p>}
            <button className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg">Authenticate</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-32 overflow-x-hidden text-xs">
      
      {/* 🌌 BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-100 h-100 bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#00f2ff]/5 blur-[120px] rounded-full" />
      </div>

      <header className="fixed top-0 w-full z-50 bg-[#020617]/60 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center text-white">
         <div className="flex items-center gap-2 text-sm font-black italic uppercase"><Shield className="text-red-600" size={18}/> Nexus HQ</div>
         <button onClick={syncRegistry} className={`p-2.5 rounded-full bg-white/5 ${isFetching ? 'animate-spin text-[#00f2ff]' : 'text-gray-400'}`}><RefreshCw size={16} /></button>
      </header>

      <main className="p-6 pt-24 max-w-5xl mx-auto relative z-10 space-y-6">
        
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
              {/* PRIMARY REVENUE CARD */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white rounded-[40px] shadow-3xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 p-6 opacity-5 text-black group-hover:rotate-12 transition-transform duration-700"><DollarSign size={100}/></div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue (KES 1,300 Fixed Sync)</p>
                <h4 className="text-5xl font-black text-slate-950 tracking-tighter leading-none mb-6">KES {metrics.totalRevenue.toLocaleString()}</h4>
                <div className="flex gap-2">
                   <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-xl uppercase tracking-widest leading-none">Today: +{metrics.todayRevenue.toLocaleString()}</span>
                   <span className="text-[8px] font-black bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-xl uppercase tracking-widest leading-none">Nodes: {metrics.nodeCount}</span>
                </div>
              </motion.div>

              {/* STATS MATRIX */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <div className="bg-[#0a0f1e] border border-white/10 p-6 rounded-[35px] text-center"><p className="text-[8px] font-black text-gray-500 uppercase mb-2">Verified</p><h4 className="text-2xl font-black">{metrics.verifiedCount}</h4></div>
                <div className="bg-[#0a0f1e] border border-white/10 p-6 rounded-[35px] text-center"><p className="text-[8px] font-black text-amber-500 uppercase mb-2">Pending</p><h4 className="text-2xl font-black">{metrics.pendingCount}</h4></div>
                <div className="bg-[#0a0f1e] border border-white/10 p-6 rounded-[35px] text-center"><p className="text-[8px] font-black text-red-500 uppercase mb-2">Banned</p><h4 className="text-2xl font-black">{metrics.bannedCount}</h4></div>
                <div className="bg-[#0a0f1e] border border-white/10 p-6 rounded-[35px] text-center"><p className="text-[8px] font-black text-[#00f2ff] uppercase mb-2">Total Visits</p><h4 className="text-2xl font-black">{totalTraffic.toLocaleString()}</h4></div>
              </div>

              {/* DATA PULSE CARD */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 bg-[#0a0f1e] border-2 border-white/10 rounded-[40px] shadow-3xl relative overflow-hidden group">
                <div className="flex justify-between items-start relative z-10 mb-8 px-2">
                   <div className="space-y-1"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Network Traffic</p><h4 className="text-3xl font-black text-white italic">Real-time Relay</h4></div>
                   <div className="p-3 bg-[#00f2ff]/10 rounded-2xl text-[#00f2ff] border border-[#00f2ff]/20"><Globe size={20}/></div>
                </div>
                <div className="flex gap-1.5 h-16 items-end">
                   {[40, 80, 50, 100, 70, 90, 60, 85, 45, 75, 55, 95].map((h, i) => (
                     <motion.div key={i} animate={{ height: [`${h * 0.5}%`, `${h}%`, `${h * 0.7}%`] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }} className="flex-1 bg-[#00f2ff]/20 rounded-t-sm border-t border-[#00f2ff]/40 shadow-[0_0_10px_rgba(0,242,255,0.1)]" />
                   ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "nodes" && (
          <div className="space-y-6">
             <div className="space-y-4 px-2">
                <h3 className="text-xl font-black uppercase italic tracking-widest text-white leading-none">Registry <span className="text-red-600">Scan</span></h3>
                <div className="relative"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={14} /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="FILTER NODES..." className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black text-white w-full outline-none focus:border-red-600 transition-all uppercase tracking-widest" /></div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase())).map((node) => (
                  <motion.div key={node.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white/3 border border-white/5 rounded-[35px] relative overflow-hidden shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center font-black text-lg text-white shadow-lg leading-none">{node.name.charAt(0)}</div>
                          <div><h4 className="text-sm font-black uppercase italic text-white leading-none mb-1">{node.name}</h4><p className="text-[8px] text-gray-500 font-bold uppercase">{node.email}</p></div>
                       </div>
                       <span className={`px-3 py-1.5 rounded-full text-[7px] font-black uppercase border ${node.status === 'Verified' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : node.status === 'Pending' ? 'border-amber-500 text-amber-500 bg-amber-500/5 animate-pulse' : 'border-red-600 text-red-600 bg-red-600/5'}`}>{node.status}</span>
                    </div>
                    <div className="bg-black/40 p-4 rounded-2xl mb-6 border border-white/5 flex justify-between items-center"><span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest italic leading-none">Synced Asset</span><p className="text-[13px] font-black text-[#00f2ff] leading-none">KES {getDisplayBalance(node).toLocaleString()}</p></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       <button onClick={() => handleCommand(verifyUserNode, node.id, "Approve")} className="py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase italic active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 tracking-widest"><UserCheck size={12}/> Approve</button>
                       <button onClick={() => handleCommand(terminateUserNode, node.id, "Reject")} className="py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase italic active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 tracking-widest"><ShieldAlert size={12}/> Reject</button>
                       <button onClick={() => alert("Logic: Use Clerk Dashboard for instant bans.")} className="py-4 bg-amber-600 text-white rounded-2xl text-[9px] font-black uppercase italic active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 tracking-widest"><Ban size={12}/> Ban</button>
                       <button onClick={() => handleCommand(terminateUserNode, node.id, "Kill")} className="py-4 bg-red-600 text-white rounded-2xl text-[9px] font-black uppercase italic active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 tracking-widest"><Trash2 size={12}/> Delete</button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 w-[92%] max-w-md h-16 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-around px-4 shadow-2xl">
         <button onClick={() => setActiveTab("dashboard")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "dashboard" ? 'text-red-600 scale-110' : 'text-gray-500'}`}><BarChart size={18}/><span className="text-[7px] font-black uppercase tracking-tighter">Pulse</span></button>
         <button onClick={() => setActiveTab("nodes")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "nodes" ? 'text-red-600 scale-110' : 'text-gray-500'}`}><Users size={18}/><span className="text-[7px] font-black uppercase tracking-tighter">Registry</span></button>
         <button onClick={syncRegistry} className="flex flex-col items-center gap-1 text-gray-500 active:scale-90 transition-all"><RefreshCw size={18} className={isFetching ? "animate-spin text-[#00f2ff]" : ""}/><span className="text-[7px] font-black uppercase tracking-tighter">Sync</span></button>
      </nav>
    </div>
  );
}