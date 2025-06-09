import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import HeaderClient from "../components/HeaderClient";
import { UserProvider } from '../context/UserContext';
import Head from 'next/head';

const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  variable: '--font-league-spartan',
});

export const metadata: Metadata = {
  title: "SnapSpaces - Your Digital Workspace",
  description: "A modern workspace management platform",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>SnapSpaces – Book Top Creatives Instantly</title>
        <meta name="description" content="SnapSpaces is the modern, premium creative marketplace for booking photographers, videographers, and more across South Africa." />
        <meta property="og:title" content="SnapSpaces – Book Top Creatives Instantly" />
        <meta property="og:description" content="SnapSpaces is the modern, premium creative marketplace for booking photographers, videographers, and more across South Africa." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://snapspaces.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SnapSpaces – Book Top Creatives Instantly" />
        <meta name="twitter:description" content="SnapSpaces is the modern, premium creative marketplace for booking photographers, videographers, and more across South Africa." />
        <meta name="twitter:image" content="/og-image.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <body className={`${leagueSpartan.variable} font-sans`}>
        <UserProvider>
          <HeaderClient />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
