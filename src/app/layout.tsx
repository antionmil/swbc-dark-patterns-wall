import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";

/* Anton for the figures, Archivo for everything else. Nothing in common with
   day 6, 7, 8 or the version this replaces — four sites in a row sharing a
   typeface reads as one site shipped four times. */
const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-loaded",
  display: "swap",
});
const body = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-body-loaded",
  display: "swap",
});

const TITLE = "What one click agrees to";
const DESC =
  "Ninety sites measured. Every consent dialog counted: how many companies one press covers, which of them offer no way to decline, and which charge you for declining. Described, never guessed at.";

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
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0B0B0B"/><rect x="4" y="4" width="24" height="24" fill="#D6FF3F"/><rect x="9" y="9" width="14" height="4" fill="#0B0B0B"/><rect x="9" y="16" width="14" height="4" fill="#0B0B0B"/></svg>`,
          ),
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
