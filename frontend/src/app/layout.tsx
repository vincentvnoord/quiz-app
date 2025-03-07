import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["100", "400", "300", "500", "700", "900"],
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Join a quiz and test your knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased h-fit`}
      >
        {children}
      </body>
    </html>
  );
}
