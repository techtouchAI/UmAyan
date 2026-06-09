import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingButton } from "@/components/layout/FloatingButton";
import { getSiteSettings } from "@/lib/api";
import { Toaster } from "react-hot-toast";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "الاستشارات النفسية",
  description: "منصة ويب متطورة لتقديم الاستشارات النفسية والتوجيه الأسري",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} font-sans min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          <Header settings={settings} />
          <div className="flex-grow flex flex-col mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <main className="flex-grow pb-8 pt-4">
              {children}
            </main>
            <Footer settings={settings} />
          </div>
          <FloatingButton settings={settings} />
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
