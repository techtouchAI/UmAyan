import {
  Amiri,
  Tajawal,
  Cairo,
  Almarai,
  IBM_Plex_Sans_Arabic,
  Noto_Kufi_Arabic,
  Noto_Naskh_Arabic,
  Rubik,
  Readex_Pro,
  Changa
} from "next/font/google";

export const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });
export const tajawal = Tajawal({ subsets: ["arabic"], weight: ["300", "400", "500", "700"], variable: "--font-tajawal" });
export const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });
export const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700", "800"], variable: "--font-almarai" });
export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], variable: "--font-ibm-plex" });
export const notoKufiArabic = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--font-noto-kufi" });
export const notoNaskhArabic = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-noto-naskh" });
export const rubik = Rubik({ subsets: ["arabic"], variable: "--font-rubik" });
export const readexPro = Readex_Pro({ subsets: ["arabic"], variable: "--font-readex-pro" });
export const changa = Changa({ subsets: ["arabic"], variable: "--font-changa" });

export const fontVariables = `${amiri.variable} ${tajawal.variable} ${cairo.variable} ${almarai.variable} ${ibmPlexSansArabic.variable} ${notoKufiArabic.variable} ${notoNaskhArabic.variable} ${rubik.variable} ${readexPro.variable} ${changa.variable}`;

export const fontsMap: Record<string, string> = {
  Amiri: "var(--font-amiri), serif",
  Tajawal: "var(--font-tajawal), sans-serif",
  Cairo: "var(--font-cairo), sans-serif",
  Almarai: "var(--font-almarai), sans-serif",
  "IBM Plex Sans Arabic": "var(--font-ibm-plex), sans-serif",
  "Noto Kufi Arabic": "var(--font-noto-kufi), sans-serif",
  "Noto Naskh Arabic": "var(--font-noto-naskh), serif",
  Rubik: "var(--font-rubik), sans-serif",
  "Readex Pro": "var(--font-readex-pro), sans-serif",
  Changa: "var(--font-changa), sans-serif",
};

export const fontOptions = Object.keys(fontsMap);
