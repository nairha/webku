import { Poppins, Geist_Mono } from "next/font/google";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});









