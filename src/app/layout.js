import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "LearnHub | Learning Management System",
  description: "Browse courses, watch lessons and learn at your own pace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Figtree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-grow px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
