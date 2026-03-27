"use client";

import { useState } from "react";
import { createJob } from "@/app/dashboard/_actions";

export const ClientView = () => {
  const [isPosting, setIsPosting] = useState(false);

  async function handleSubmit(formData: FormData) {
    const res = await createJob(formData);
    if (res.success) {
      setIsPosting(false);
      alert("Gig posted to the Nexus successfully!");
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 border border-purple-500/30 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <h3 className="text-purple-400 font-bold uppercase text-xs tracking-widest">Open Jobs</h3>
          <p className="text-4xl font-black mt-2 text-white">0</p>
        </div>
        
        <button 
          onClick={() => setIsPosting(true)}
          className="md:col-span-2 p-6 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-500/20"
        >
          + POST A NEW GIG
        </button>
      </div>

      {isPosting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <form action={handleSubmit} className="bg-[#0f172a] border border-purple-500/30 p-8 rounded-3xl max-w-xl w-full space-y-4 shadow-2xl">
            <h2 className="text-2xl font-black text-white uppercase italic">Post a Vision</h2>
            
            <input name="title" placeholder="Job Title (e.g. Next.js Developer Needed)" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-purple-500" required />
            
            <select name="category" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-purple-500" required>
              <option value="Web Development">Web Development</option>
              <option value="Design">3D / Graphic Design</option>
              <option value="Trading">Trading / Finance</option>
            </select>

            <textarea name="description" placeholder="Describe the mission..." className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white h-32 outline-none focus:border-purple-500" required />
            
            <input name="budget" type="number" placeholder="Budget (USD)" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-purple-500" required />

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-400">Launch Gig</button>
              <button type="button" onClick={() => setIsPosting(false)} className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl hover:bg-white/5">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};