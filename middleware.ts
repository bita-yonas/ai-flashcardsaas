import { clerkMiddleware } from "@clerk/nextjs/server";

export default async function middleware(request) {
  if (process.env.NEXT_RUNTIME !== 'edge') {
    return clerkMiddleware()(request);
  }

  // Edge-compatible logic here (e.g., simple auth checks without Clerk)
  return new Response('Edge runtime detected. Clerk is disabled.');
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
