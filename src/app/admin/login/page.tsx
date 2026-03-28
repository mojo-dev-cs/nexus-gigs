"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Nexus123!") {
      // Store a temporary session flag
      sessionStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-black/40 border border-red-500/20 p-10 rounded-[48px] backdrop-blur-xl text-center shadow-2xl">
        <h1 className="text-2xl font-black italic text-red-500 uppercase mb-2">Nexus <span className="text-white">HQ</span></h1>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">Authorization Required</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            value={password}
            onChange={(e) => {setPassword(e.target.value); setError(false);}}
            placeholder="ENTER ACCESS KEY" 
            className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-red-500 transition-all`}
          />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-red-500 shadow-lg shadow-red-500/10">
            Authenticate →
          </button>
          {error && <p className="text-[10px] font-black text-red-500 uppercase mt-2">Access Denied: Invalid Key</p>}
        </form>
      </div>
    </div>
  );
}