import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define all public routes
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/sso-callback(.*)',
  '/api/intasend(.*)', 
  '/api/webhooks(.*)',
  '/admin(.*)' // Allows the admin page to handle its own pass-key auth
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  // 2. Manual Protection: If not public and no user, redirect to sign-in
  if (!isPublicRoute(req) && !session.userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  // 3. Matcher for Next.js/Clerk compatibility
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};