import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pagora",
  description: "Envía y recibe dinero fácil, rápido y seguro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${inter.variable} font-body antialiased bg-bg text-ink`}>
        <div className="mx-auto min-h-screen max-w-[400px] bg-bg">{children}</div>
      </body>
    </html>
  );
}
