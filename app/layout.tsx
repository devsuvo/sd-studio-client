import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import RouteProgress from "@/components/route-progress";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: { default: "SD Studio — Book creative studios by the hour", template: "%s · SD Studio" },
  description:
    "Find and book photography cyc walls, sound stages, podcast lounges, recording suites and art workshops from local hosts.",
};

// Applies the saved theme before paint so there's no light/dark flash on reload.
const themeScript = `try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <RouteProgress />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
