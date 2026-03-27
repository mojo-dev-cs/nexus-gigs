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
const onboardingComplete = (sessionClaims?.metadata as { onboardingComplete?: boolean })?.onboardingComplete;

// Update the logic: ONLY redirect to onboarding if NOT complete
if (userId && !onboardingComplete && request.nextUrl.pathname !== "/onboarding" && !isPublicRoute(request)) {
  return NextResponse.redirect(new URL("/onboarding", request.url));
}if (userId && request.nextUrl.pathname === "/") {
  // ...and they have a role, send to dashboard
  if (role) return NextResponse.redirect(new URL("/dashboard", request.url));
  // ...and they DON'T have a role, send to onboarding
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