import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EventPlanner - La forma más inteligente de organizar tu evento",
  description: "Tu agenda de eventos, simplificada. Gestiona y disfruta de cada momento sin complicaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
