import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define public routes - we MUST include /admin here so it can use its own password logic
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/sso-callback(.*)',
  '/api/intasend(.*)', 
  '/api/webhooks(.*)',
  '/admin(.*)' // 👈 THIS ALLOWS ADMIN TO BYPASS CLERK REDIRECTS
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  // 2. If it's not a public route and the user isn't logged in, send to sign-in
  if (!isPublicRoute(req) && !session.userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};