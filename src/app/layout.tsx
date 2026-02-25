import type { Metadata } from "next";
import "./globals.css";
import AuthLayout from "@/components/AuthLayout";

export const metadata: Metadata = {
  title: "AI管理后台",
  description: "AI管理后台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthLayout>{children}</AuthLayout>
      </body>
    </html>
  );
}
