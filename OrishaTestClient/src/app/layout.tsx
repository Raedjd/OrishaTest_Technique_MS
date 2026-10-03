import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: 'Orisha Commerce',
    description: 'Orisha Commerce dashboard',
    icons: {
        icon: [
            {
                url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="tri" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23ffc93c"/><stop offset="50%" stop-color="%23e5007d"/><stop offset="100%" stop-color="%23ffc93c"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="%234b2c82"/><polygon points="50,14 90,50 50,86" fill="url(%23tri)"/><text x="46" y="70" font-family="Arial, sans-serif" font-size="58" font-weight="bold" fill="white" text-anchor="middle">O</text></svg>',
                type: 'image/svg+xml',
            },
        ],
    },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      {children}
      </body>
      </html>
  );
}
