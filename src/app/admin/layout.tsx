import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const adminEmail = "mojojojjy@gmail.com"; // Your Secure Entry Key

  if (!user || user.emailAddresses[0].emailAddress !== adminEmail) {
    redirect("/dashboard");
  }

  const menuItems = [
    { label: "Overview", icon: "📊", href: "/admin" },
    { label: "Users", icon: "👤", href: "/admin/users" },
    { label: "Payments", icon: "💰", href: "/admin/payments" },
    { label: "Gigs", icon: "💼", href: "/admin/gigs" },
    { label: "Disputes", icon: "⚖️", href: "/admin/disputes" },
    { label: "Marketing", icon: "📢", href: "/admin/marketing" },
    { label: "Settings", icon: "⚙️", href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      {/* --- 🛡️ SIDEBAR --- */}
      <aside className="w-64 border-r border-red-500/10 bg-black/20 backdrop-blur-xl fixed h-full flex flex-col">
        <div className="p-8">
          <h1 className="font-black italic text-red-500 uppercase tracking-tighter text-2xl">
            NEXUS <span className="text-white">HQ</span>
          </h1>
          <p className="text-[8px] font-bold text-gray-500 tracking-[0.2em] mt-1">COMMAND CENTER V1.0</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-red-500/5 hover:text-red-500 transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center font-black italic text-black uppercase">
              {user.firstName?.[0]}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase">{user.firstName}</p>
              <p className="text-[8px] text-gray-500 font-bold uppercase">Overseer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- 🖥️ MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent">
        {children}
      </main>
    </div>
  );
}