import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  // 1. If not logged in and trying to access a private page, protect it
  if (!userId && !isPublicRoute(request)) {
    await auth.protect();
  }

  // 2. If logged in, check if they have a role in their metadata
const role = (sessionClaims?.metadata as { role?: string })?.role;
  // 3. If they are logged in but haven't finished onboarding, force them to /onboarding
  // (But don't redirect if they are already ON the onboarding page!)
  if (
    userId && 
    !role && 
    request.nextUrl.pathname !== "/onboarding" &&
    !isPublicRoute(request)
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 4. If they HAVE a role and try to go back to onboarding, send them to dashboard
  if (userId && role && request.nextUrl.pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};