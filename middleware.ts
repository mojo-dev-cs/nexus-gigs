import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are public (anyone can see)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/mpesa-callback(.*)' // Ensure your callback is public!
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};