import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap"
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap"
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${playfair.variable} ${manrope.variable} ${jetbrains.variable} antialiased`}> 
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
