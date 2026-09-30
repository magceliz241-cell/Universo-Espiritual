import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Seu Universo", template: "%s · Seu Universo" },
  description: "Seu observatório pessoal: mapa astral, Lua, Tarot, numerologia, sonhos e o seu Guia.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#090812",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${inter.variable} h-full`}>
      <body className="relative min-h-full">
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
