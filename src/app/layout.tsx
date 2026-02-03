import type { Metadata } from "next";
import { DM_Mono, Sora } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap"
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Cashflow | Household Budgeting",
  description: "Modern household budgeting with shared templates and monthly tracking."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${dmMono.variable} antialiased`}> 
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
