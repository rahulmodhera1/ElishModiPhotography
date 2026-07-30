import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Geist } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Type pairing.
 *
 * Bodoni Moda for display. A true high-contrast didone: the thick-to-thin
 * stroke is what makes a masthead read as a masthead, and it is the reason
 * this specific serif fits a photographer whose work is about tonal range.
 * It carries headlines and prices only, never body copy.
 *
 * Geist for everything else. Tight, neutral, gets out of the way of the
 * pictures, and pairs with a didone without competing with it.
 */
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elishmodi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | ${site.discipline} in ${site.city}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Portrait, editorial and wedding photography by Elish Modi. Unhurried sessions in Toronto and across Ontario, available for travel.",
  keywords: [
    "Toronto portrait photographer",
    "editorial photographer",
    "wedding photographer Ontario",
    "commercial photography Toronto",
  ],
  authors: [{ name: site.name }],
  icons: { icon: "/images/brand/favicon.png" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: site.name,
    title: `${site.name} | ${site.discipline}`,
    description:
      "Portrait, editorial and wedding photography, made unhurried. Toronto and across Ontario.",
    images: [{ url: "/images/og/og-image.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.discipline}`,
    description: "Portrait, editorial and wedding photography, made unhurried.",
    images: ["/images/og/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  /* No maximum-scale and no user-scalable=no. Pinch zoom stays available. */
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      /* Theme is locked dark for the whole page. See globals.css. */
      data-scroll-behavior="smooth"
      className={`${bodoni.variable} ${geist.variable} antialiased`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
