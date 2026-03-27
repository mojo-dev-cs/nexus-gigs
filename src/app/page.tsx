import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LandingPage() {
  const { userId } = await auth();
  const user = await currentUser();

  // If logged in, check their role and teleport them!
  if (userId && user) {
    const onboardingComplete = user.publicMetadata?.onboardingComplete;
    const role = user.publicMetadata?.role;

    if (!onboardingComplete) {
      redirect("/onboarding");
    } else {
      redirect("/dashboard");
    }
  }

  // ONLY show the landing page if they are logged OUT
  return (
    <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-6xl font-black uppercase tracking-tighter italic mb-4">
        NEXUS<span className="text-[#00f2ff]">GIGS</span>
      </h1>
      <p className="text-gray-400 mb-8 max-w-md text-center">
        The future of freelancing globally. Immersive. Secure. Decentralized.
      </p>
      <div className="flex gap-4">
        <Link href="/sign-up" className="px-8 py-4 bg-[#00f2ff] text-black font-black rounded-xl hover:scale-105 transition-all">
          GET STARTED
        </Link>
        <Link href="/sign-in" className="px-8 py-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all">
          SIGN IN
        </Link>
      </div>
    </main>
  );
}