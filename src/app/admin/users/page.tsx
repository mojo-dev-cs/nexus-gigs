"use client";

import { useEffect, useState } from "react";
import { getAllNexusUsers } from "../_actions/users";

export default function UsersModule() {
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const result = await getAllNexusUsers();
      if (result.success) setOperators(result.users || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-red-500 font-black">SCANNING NETWORK...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Operator <span className="text-red-500">Registry</span></h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">Authenticated Nodes in Nexus Grid</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white hover:text-black">Export CSV</button>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
            <tr>
              <th className="p-8">Operator</th>
              <th className="p-8">Status</th>
              <th className="p-8 text-right">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {operators.map((op) => (
              <tr key={op.id} className="hover:bg-white/2 transition-colors">
                <td className="p-8">
                  <p className="font-black italic uppercase text-sm">{op.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold">{op.email}</p>
                </td>
                <td className="p-8">
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${op.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                    {op.status}
                  </span>
                </td>
                <td className="p-8 text-right">
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase hover:text-red-500">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}