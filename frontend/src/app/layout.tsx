import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastContainer from "./components/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetFicticia - Sistema de Apuestas Ficticias",
  description: "Plataforma de apuestas ficticias sin riesgo real. Practica tus estrategias con 10,000 créditos gratis. Apuestas deportivas y de entretenimiento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
