import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CNA Lighting | Premium LED Products",
  description:
    "CNA Lighting — Canada's trusted source for premium LED lighting solutions. Filament bulbs, reflectors, downlights, strip lights and more.",
  icons: {
    icon: "/brand_assets/CNA-Logo-Favicon-000080.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
