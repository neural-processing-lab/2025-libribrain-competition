import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { assetPath } from "../lib/assetPath";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "PNPL Competition | Neural Speech Decoding",
  description: "The PNPL Competition: Decoding language from the brain using MEG data. Built around the LibriBrain100 dataset. Organised by the Parker Jones Neural Processing Lab at Oxford.",
  icons: {
    icon: assetPath("/favicon.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}>
        {children}
        {/* Umami analytics — self-hosted on Railway, cookieless. data-domains restricts
            tracking to the production hostname, so local dev and forks send nothing. */}
        <Script
          src="https://stats.neuralprocessinglab.com/script.js"
          data-website-id="4b91d29a-fb6c-4493-a336-3088b1c3708d"
          data-domains="neural-processing-lab.github.io,libribrain.com"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
