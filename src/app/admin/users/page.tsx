"use client";

import { useEffect, useState } from "react";
import { getAllNexusUsers } from "../_actions/users";

// Make sure "export default" is here!
export default function UsersModule() {
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const result = await getAllNexusUsers();
      if (result.success) {
        setOperators(result.users || []);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-pulse">
        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Scanning Network Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Operator <span className="text-red-500">Registry</span></h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">Authenticated Nodes in Nexus Grid</p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
            <tr>
              <th className="p-8">Operator</th>
              <th className="p-8">Access Level</th>
              <th className="p-8">Status</th>
              <th className="p-8 text-right">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {operators.map((op) => (
              <tr key={op.id} className="hover:bg-white/2 transition-colors group">
                <td className="p-8">
                  <p className="font-black italic uppercase text-sm group-hover:text-red-500 transition-colors">{op.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold">{op.email}</p>
                </td>
                <td className="p-8">
                   <span className="text-[10px] font-black uppercase tracking-tighter bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                    {op.role}
                   </span>
                </td>
                <td className="p-8">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${op.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                    {op.status}
                  </span>
                </td>
                <td className="p-8 text-right font-black text-[9px] text-gray-600 hover:text-white cursor-pointer transition-colors">
                  MANAGE NODE →
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}