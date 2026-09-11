import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display-loaded",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-loaded",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-loaded",
  display: "swap",
});

const TITLE = "Six small obstructions";
const DESC =
  "Six browser captures — four consent dialogs, a sign-up form and a page of search results — with the awkward part pinned and counted. Described, never guessed at.";

export const metadata: Metadata = {
  metadataBase: new URL("https://darkpatterns.onedaybuilt.com"),
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://darkpatterns.onedaybuilt.com",
    siteName: TITLE,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0E1014"/><circle cx="16" cy="16" r="9" fill="#FF4D88"/><text x="16" y="21" font-family="ui-monospace,Menlo,monospace" font-size="13" font-weight="700" fill="#14060C" text-anchor="middle">1</text></svg>`,
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
