import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppAuthProvider } from "@/components/app-auth-provider";
import { ThemePicker } from "@/components/theme-picker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Worldie 26 | Фантази Светско првенство",
  description:
    "Предвиди го турнирскиот костур и секој натпревар од Светското првенство 2026. Искачи се на вкупната табела.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mk" data-theme="usa" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={geistSans.className}>
        <AppAuthProvider>
          {children}
          <ThemePicker />
        </AppAuthProvider>
      </body>
    </html>
  );
}
