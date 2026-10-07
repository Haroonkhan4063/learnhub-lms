import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ token, req }) =>
      req.nextUrl.pathname.startsWith("/admin") ? token?.role === "admin" : !!token,
  },
});

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
