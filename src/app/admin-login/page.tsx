"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    if (password === "Nexus123!") {
      // 💾 Save to BOTH storage types for maximum compatibility
      sessionStorage.setItem("admin_auth", "true");
      localStorage.setItem("admin_auth_backup", "true"); 

      // 🚀 HARD REDIRECT: Bypasses the router hang
      window.location.href = "/admin";
    } else {
      setIsAuthenticating(false);
      alert("INVALID ACCESS KEY");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-black/40 border border-red-500/20 p-10 rounded-[48px] backdrop-blur-xl text-center shadow-2xl">
        <h1 className="text-2xl font-black italic text-red-500 uppercase mb-8">Nexus <span className="text-white">HQ</span></h1>
        <input 
          type="password" 
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ENTER ACCESS KEY" 
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-red-500 mb-4"
        />
        <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all">
          {isAuthenticating ? "VERIFYING..." : "Authenticate →"}
        </button>
      </form>
    </div>
  );
}