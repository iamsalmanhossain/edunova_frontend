import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a4b32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "EduNova — Digital Campus Platform",
    template: "%s | EduNova",
  },
  description:
    "EduNova is an enterprise digital campus platform empowering institutional excellence, academic operations, student success, and administration.",
  keywords: [
    "EduNova",
    "Digital Campus",
    "Institutional Management",
    "Polytechnic",
    "Academic Management",
    "Student Portal",
    "Faculty Portal",
  ],
  authors: [{ name: "Md Salman Hossain" }],
  openGraph: {
    title: "EduNova — Digital Campus Platform",
    description:
      "Enterprise digital campus platform empowering institutional excellence and academic operations.",
    type: "website",
    locale: "en_US",
    siteName: "EduNova Digital Campus",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
