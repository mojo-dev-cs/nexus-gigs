import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/shared/Navbar"; // Import the Navbar
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#020617] antialiased selection:bg-[#00f2ff]/30">
          <Navbar />
          {/* We add pt-24 (padding-top) so the content doesn't hide behind the fixed navbar */}
          <div className="pt-24">
            {children}
          </div>
<script src="https://unpkg.com/intasend-inlinejs-sdk@4.0.7/build/intasend-inline.js" async></script>
        </body>
      </html>
    </ClerkProvider>
  );
}