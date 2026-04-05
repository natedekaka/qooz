import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qooz - Real-time Quiz Platform",
  description: "Platform kuis real-time untuk pembelajaran interaktif",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#667eea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased pb-12">
        {children}
        <footer className="fixed bottom-2 right-2 bg-gray-900/70 backdrop-blur-sm text-white/60 px-3 py-1.5 rounded-full text-xs">
          By Natedekaka 2026
        </footer>
      </body>
    </html>
  );
}
