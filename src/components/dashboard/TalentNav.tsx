"use client";

export const TalentNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'tasks', label: 'Tasks', icon: '💼' },
    { id: 'upload', label: 'Upload', icon: '📤' },
    { id: 'account', label: 'Account', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center md:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-[#00f2ff]' : 'text-gray-500'}`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};