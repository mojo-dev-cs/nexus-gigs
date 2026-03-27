import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      {/* This handles the login form */}
      <SignIn signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  );
}