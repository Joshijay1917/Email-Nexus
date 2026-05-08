import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") || "";

  // Check if requesting root "/" with "text/markdown" header
  if (request.nextUrl.pathname === "/" && acceptHeader.includes("text/markdown")) {
    const origin = request.nextUrl.origin;
    try {
      const res = await fetch(`${origin}/product.md`);
      if (res.ok) {
        const markdownContent = await res.text();
        return new Response(markdownContent, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch (error) {
      console.error("Error serving markdown via proxy:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
// Replaced deprecated middleware.ts with Next.js 16's new proxy.ts convention
