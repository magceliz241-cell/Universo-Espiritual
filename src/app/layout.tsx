import type { Metadata, Viewport } from "next";
import { Cinzel, Instrument_Serif, Inter, Noto_Sans_Symbols } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/** Marca e rótulos em maiúsculas (logo ASTAROT). */
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/** Glifos astrológicos em traço (evita a versão emoji de ☉ ☽ ♈ nos celulares). */
const glyphs = Noto_Sans_Symbols({
  variable: "--font-glyphs",
  subsets: ["symbols"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: { default: "Astarot", template: "%s · Astarot" },
  description: "Seu observatório pessoal: mapa astral, Lua, Tarot, numerologia, sonhos e o seu Guia.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0714",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${cinzel.variable} ${inter.variable} ${glyphs.variable} h-full`}>
      <body className="relative min-h-full">
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
