import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "United Space Data | The World's Space Data Archive",
  description: "Open-access repository for space research, astronomy data, mission files, and scientific papers.",
  keywords: "space data, astronomy, NASA, ESA, research papers, satellites, missions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
