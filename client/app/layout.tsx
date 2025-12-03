import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Configure local fonts
const akkurat = localFont({
  src: [
    {
      path: "../public/fonts/Akkurat-Normal.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Akkurat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-akkurat",
});

export const metadata: Metadata = {
  title: "CEC Website",
  description: "Campus Events Commission Archive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font class to the body */}
      <body className={akkurat.className}>
        {children}
      </body>
    </html>
  );
}