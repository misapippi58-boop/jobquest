import type { Metadata } from "next";
import BottomNav from "./ui/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobQuest",
  description: "就活管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="bg-pink-50">
      <body className="antialiased min-h-screen bg-pink-50 relative pb-24">
        {children}

        <BottomNav />
      </body>
    </html>
  );
}