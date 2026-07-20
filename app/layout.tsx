import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

const lora = Lora({

subsets: ["latin"],

weight: ["400", "500"],

style: ["normal", "italic"],

variable: "--font-serif",

});

const dmSans = DM_Sans({

subsets: ["latin"],

weight: ["300", "400", "500", "600"],

variable: "--font-sans",

});

export const metadata: Metadata = {
  title: "Forge AI",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${lora.variable} ${dmSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
