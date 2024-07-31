import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";



const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/", "/api/webhooks/clerk"]);

const isProtectedRoute = createRouteMatcher([
  '/about(.*)','/admin(.*)','/tickets(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
  if (!isPublicRoute(req)) auth().protect();
});



export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};