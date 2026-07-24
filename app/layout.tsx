import type { Metadata } from "next";
import { Manrope, Red_Hat_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const redHat = Red_Hat_Display({
  variable: "--font-red-hat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FutBots — AI football predictions",
  description:
    "Explore FIFA World Cup match predictions, scorelines, totals and handicap insights.",
  icons: {
    icon: "/assets/brand-ball.svg",
    shortcut: "/assets/brand-ball.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${redHat.variable}`}>
        {children}
      </body>
    </html>
  );
}
