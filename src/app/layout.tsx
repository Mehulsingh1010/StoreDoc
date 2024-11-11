import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import AuthLayout from "@/components/AuthLayout";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "StoreDoc",
  description: "StoreDoc : The storage solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <AuthLayout> {children}</AuthLayout>
      </body>
    </html>
  );
}
