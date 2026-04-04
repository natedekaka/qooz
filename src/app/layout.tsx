import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qooz - Real-time Quiz Platform",
  description: "Platform kuis real-time untuk pembelajaran interaktif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-center py-2 text-sm">
          natedekaka 2026
        </footer>
      </body>
    </html>
  );
}
