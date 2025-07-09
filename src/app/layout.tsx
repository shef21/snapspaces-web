import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import HeaderClient from "../components/HeaderClient";
import { UserProvider } from '../context/UserContext';
import React from 'react';
import { Inter } from 'next/font/google';

const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  variable: '--font-league-spartan',
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "SnapSpaces - Your Digital Workspace",
  description: "A modern workspace management platform",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "manifest", url: "/site.webmanifest" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${inter.className}`}>
      <body>
        <UserProvider>
          <HeaderClient />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}