import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans, Roboto } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next";

const CustomScrollbar = dynamic(() => import("@/components/CustomScrollbar"), { ssr: false });

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

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-roboto",
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
    <html lang="en" className={`${barlowCondensed.variable} ${dmSans.variable} ${roboto.variable}`}>
      <body>
        {children}
        <CustomScrollbar />
        <Analytics />
      </body>
    </html>
  );
}
