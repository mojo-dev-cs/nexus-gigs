import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define public routes
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/intasend(.*)', 
  '/api/webhooks(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  // 2. Manual Protection Logic (Avoids the .protect() type error)
  if (!isPublicRoute(req) && !session.userId) {
    // If user is not logged in and trying to access a private route, redirect to sign-in
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};