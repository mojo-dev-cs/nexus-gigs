"use client";

import { useState } from "react";

export default function UsersModule() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Users - We will fetch these from MongoDB/Clerk later
  const operators = [
    { id: "1", name: "Emmanuel Muema", email: "mojojojjy@gmail.com", role: "Visionary", status: "Verified", joined: "Mar 28, 2026" },
    { id: "2", name: "John Doe", email: "j.doe@student.ku.ac.ke", role: "Freelancer", status: "Unverified", joined: "Mar 29, 2026" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Operator <span className="text-red-500">Registry</span></h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">Manage all nodes within the Nexus network</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="SEARCH BY NAME/EMAIL..." 
            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-black outline-none focus:border-red-500/50 w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
            <tr>
              <th className="p-8">Operator Details</th>
              <th className="p-8">Protocol Role</th>
              <th className="p-8">Access Level</th>
              <th className="p-8 text-right">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {operators.map((op) => (
              <tr key={op.id} className="group hover:bg-white/2 transition-colors">
                <td className="p-8">
                  <p className="font-black italic uppercase text-sm">{op.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold">{op.email}</p>
                </td>
                <td className="p-8">
                  <span className="text-[10px] font-black uppercase tracking-widest">{op.role}</span>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${op.status === 'Verified' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
                    <span className={`text-[10px] font-black uppercase italic ${op.status === 'Verified' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {op.status}
                    </span>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">
                    Modify Protocol
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}