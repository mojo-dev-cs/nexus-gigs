import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      {/* This component handles the entire registration form automatically */}
      <SignUp signInUrl="/sign-in" forceRedirectUrl="/onboarding" />
    </div>
  );
}