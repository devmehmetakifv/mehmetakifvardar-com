import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mehmet Akif Vardar | Cybersecurity Researcher & Developer",
  description: "Portfolio of Mehmet Akif Vardar - Cybersecurity Researcher, Penetration Tester, and Software Developer based in Istanbul, Turkey.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={firaCode.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
