import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  // 1. If logged in and trying to access the landing page '/'
  if (userId && request.nextUrl.pathname === '/') {
    const onboardingComplete = (sessionClaims?.metadata as any)?.onboardingComplete;
    
    // If they finished onboarding, send to dashboard
    if (onboardingComplete) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If they haven't finished, send to onboarding
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // 2. Protect dashboard routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};