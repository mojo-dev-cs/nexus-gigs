"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getAllNexusUsers, 
  verifyUserNode, 
  terminateUserNode, 
  suspendUserNode 
} from "./_actions/users"; 
import { 
  Shield, Users, DollarSign, Activity, Settings, 
  UserCheck, Search, Lock, Zap, Server, BarChart, 
  UserPlus, Briefcase, Cpu, Terminal, X, TrendingUp,
  AlertCircle, ShieldCheck, Clock, HardDrive, 
  Fingerprint, MousePointer2, RefreshCw, Landmark, Bitcoin, ChevronRight
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nodes, setNodes] = useState<NexusNode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // --- 📈 REVENUE ENGINE ---
  const metrics = useMemo(() => {
    const totalRevenue = nodes.reduce((sum, node) => sum + (node.paidBalance || 0), 0);
    const verified = nodes.filter(n => n.status === "Verified");
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const todayRevenue = nodes
      .filter(n => n.createdAt >= startOfToday)
      .reduce((sum, n) => sum + (n.paidBalance || 0), 0);

    return {
      totalRevenue,
      todayRevenue,
      nodeCount: nodes.length,
      verifiedCount: verified.length,
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

  const handleCommand = async (actionFn: Function, id: string, extra?: any) => {
    if (confirm("EXECUTE SYSTEM COMMAND?")) {
      setIsFetching(true);
      const res = await actionFn(id, extra);
      if (res.success) {
        await syncRegistry();
      } else {
        alert("Command Denied: " + res.message);
      }
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      syncRegistry();
      const heartbeat = setInterval(syncRegistry, 30000);
      return () => clearInterval(heartbeat);
    }
  }, [isAuthorized, syncRegistry]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-black border-2 border-red-500/20 p-16 rounded-[70px] text-center shadow-[0_0_150px_rgba(239,68,68,0.1)]">
          <Lock size={60} className="mx-auto mb-10 text-red-500" />
          <h1 className="text-3xl font-black italic text-white uppercase mb-8">NEXUS <span className="text-red-600">HQ</span></h1>
          <form onSubmit={(e) => { e.preventDefault(); if(passInput === "Nexus123!") { sessionStorage.setItem("nexus_admin_session", "true"); setIsAuthorized(true); } else { alert("Handshake Denied."); } }} className="space-y-6">
            <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-center font-black outline-none focus:border-red-600 transition-all tracking-[0.5em]" />
            <button className="w-full py-6 bg-red-600 text-white font-black rounded-3xl uppercase text-[12px] italic tracking-widest">Initialize Terminal</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden">
      <aside className="fixed inset-y-0 left-0 w-80 bg-black border-r border-white/5 hidden lg:flex flex-col">
        <div className="p-12 border-b border-white/5 mb-10 flex items-center gap-4">
            <Shield className="text-red-600" size={24}/>
            <h2 className="font-black italic text-2xl uppercase tracking-tighter">Nexus<span className="text-red-600">HQ</span></h2>
        </div>
        <nav className="px-8 space-y-4 flex-1">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-6 px-8 py-6 rounded-[30px] transition-all ${activeTab === "dashboard" ? 'bg-red-600 text-white shadow-2xl shadow-red-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
            <BarChart size={20}/> <span className="text-[11px] font-black uppercase tracking-widest">Pulse</span>
          </button>
          <button onClick={() => setActiveTab("nodes")} className={`w-full flex items-center gap-6 px-8 py-6 rounded-[30px] transition-all ${activeTab === "nodes" ? 'bg-red-600 text-white shadow-2xl shadow-red-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
            <Users size={20}/> <span className="text-[11px] font-black uppercase tracking-widest">Nodes</span>
          </button>
          <button onClick={syncRegistry} className="w-full flex items-center gap-6 px-8 py-6 rounded-[30px] text-gray-500 hover:text-[#00f2ff] transition-all">
            <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} /> <span className="text-[11px] font-black uppercase tracking-widest">Sync</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 lg:pl-80 p-6 md:p-16 pt-28 lg:pt-16">
        {activeTab === "dashboard" && (
          <div className="space-y-16">
            <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">System <span className="text-red-600">Pulse</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[50px] shadow-3xl hover:scale-105 transition-transform">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl"><DollarSign size={28}/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Revenue</p>
                <h4 className="text-4xl font-black text-slate-950 tracking-tighter">KES {metrics.totalRevenue.toLocaleString()}</h4>
              </div>
              <div className="bg-white p-10 rounded-[50px] shadow-3xl hover:scale-105 transition-transform">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl"><Users size={28}/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Active Nodes</p>
                <h4 className="text-4xl font-black text-slate-950 tracking-tighter">{metrics.nodeCount}</h4>
              </div>
              <div className="bg-[#0a0f1e] border-2 border-white/10 p-10 rounded-[50px] shadow-3xl hover:scale-105 transition-transform">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl"><TrendingUp size={28}/></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-red-500">Today's Inflow</p>
                <h4 className="text-4xl font-black text-white tracking-tighter">KES {metrics.todayRevenue.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        )}

        {activeTab === "nodes" && (
          <div className="space-y-12">
             <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Node <span className="text-red-600">Registry</span></h3>
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="FILTER NODES..." className="bg-white/5 border-2 border-white/10 rounded-full px-12 py-5 text-xs font-black text-white w-full md:w-96 outline-none focus:border-red-600 transition-all uppercase italic shadow-2xl" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase())).map((node) => (
                  <motion.div key={node.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-white/3 border-2 border-white/5 rounded-[60px] hover:border-red-600/40 transition-all group relative overflow-hidden shadow-3xl">
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-16 h-16 rounded-[25px] bg-white/5 flex items-center justify-center font-black text-2xl text-red-600 border border-white/10 shadow-2xl">{node.name.charAt(0)}</div>
                       <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border-2 ${node.status === 'Verified' ? 'border-emerald-500 text-emerald-500' : 'border-red-600 text-red-600'}`}>{node.status}</span>
                    </div>
                    <div className="mb-10">
                       <h4 className="text-xl font-black uppercase italic text-white leading-none mb-2">{node.name}</h4>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{node.email}</p>
                       <p className="text-[12px] font-black text-[#00f2ff] italic mt-4 uppercase">Vault Sync: KES {node.paidBalance || 0}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => handleCommand(verifyUserNode, node.id)} className="py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase italic hover:bg-emerald-700 shadow-xl">Verify</button>
                       <button onClick={() => handleCommand(suspendUserNode, node.id, !node.banned)} className="py-4 bg-amber-600 text-white rounded-2xl text-[9px] font-black uppercase italic hover:bg-amber-700 shadow-xl">{node.banned ? 'Restore' : 'Suspend'}</button>
                       <button onClick={() => handleCommand(terminateUserNode, node.id)} className="col-span-2 py-4 bg-red-600 text-white rounded-2xl text-[9px] font-black uppercase italic hover:bg-red-700 shadow-xl">Kill Connection</button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        )}
      </main>

      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden fixed bottom-12 right-10 z-200 w-20 h-20 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-[#020617]">
         {isMobileMenuOpen ? <X size={32}/> : <Terminal size={32}/>}
      </button>

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .shadow-glow { box-shadow: 0 0 15px rgba(0, 242, 255, 0.4); } `}</style>
    </div>
  );
}