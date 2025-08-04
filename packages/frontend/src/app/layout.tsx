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
  title: "Finance Dashboard",
  description: "Manage your accounts, transactions, and categories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f9fafb] text-[#111827]`}
        style={{ minHeight: "100vh", margin: 0, padding: 0 }}
      >
        <main
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1rem 1rem",
          }}
        >
          <header
  style={{
    display: "flex",
    justifyContent: "left",
    alignItems: "normal",
    padding: "0rem 0",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "1rem",
  }}
>
  <h1 style={{ fontSize: "1rem", fontWeight: 600 }}>My Finance App</h1>
</header>

          {children}
        </main>
      </body>
    </html>
  );
}
