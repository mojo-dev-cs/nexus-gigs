import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define all public routes. 
// We MUST include /admin here so it doesn't trigger the standard user redirect logic.
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/sso-callback(.*)',
  '/api/intasend(.*)', 
  '/api/webhooks(.*)',
  '/admin(.*)' // 👈 THIS PREVENTS THE REDIRECT TO USER DASHBOARD
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  // 2. Manual Protection: Only redirect to sign-in if the route is PRIVATE and user is anonymous
  if (!isPublicRoute(req) && !session.userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // If it's a public route (like /admin), we do nothing and let the page load its own logic.
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};