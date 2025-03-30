import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import StructuredData from "./structured-data";
import "./globals.css";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mehmetakifvardar.com"),
  title: "Mehmet Akif VARDAR | Cybersecurity Researcher & Developer",
  description: "Portfolio of Mehmet Akif VARDAR - Cybersecurity Researcher, Penetration Tester, and Software Developer specializing in offensive security.",
  keywords: [
    "Mehmet Akif VARDAR", 
    "Cybersecurity", 
    "Penetration Testing", 
    "Offensive Security", 
    "Web Security", 
    "Red Team", 
    "CTF Player", 
    "Software Development",
    ".NET Core Developer",
    "Istanbul",
    "TryHackMe",
    "Security Researcher"
  ],
  creator: "Mehmet Akif VARDAR",
  publisher: "Mehmet Akif VARDAR",
  authors: [{ name: "Mehmet Akif VARDAR" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mehmetakifvardar.com",
    title: "Mehmet Akif VARDAR | Cybersecurity Researcher & Developer",
    description: "Portfolio of Mehmet Akif VARDAR - Cybersecurity Researcher, Penetration Tester, and Software Developer specializing in offensive security",
    siteName: "Mehmet Akif VARDAR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mehmet Akif VARDAR - Cybersecurity Researcher & Developer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehmet Akif VARDAR | Cybersecurity Researcher & Developer",
    description: "Portfolio of Mehmet Akif VARDAR - Cybersecurity Researcher, Penetration Tester, and Software Developer specializing in offensive security, web vulnerabilities, and .NET Core development.",
    images: ["/og-image.png"]
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Mehmet Akif VARDAR"
  },
  formatDetection: {
    telephone: false
  },
  category: "portfolio"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://mehmetakifvardar.com" />
      </head>
      <body className={firaCode.className}>
        {children}
        <Analytics />
        <SpeedInsights />
        <StructuredData />
      </body>
    </html>
  );
}
