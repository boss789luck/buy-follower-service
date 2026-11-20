import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "NSPanelTHAI - บริการเพิ่มยอดโซเชียลมีเดีย อันดับ 1",
  description: "ศูนย์รวมบริการเพิ่มผู้ติดตาม ไลค์ วิว คอมเมนต์ ทุกโซเชียลมีเดีย ระบบอัตโนมัติ 24 ชั่วโมง",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
