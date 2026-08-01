import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cordelia and the Beneficent Misfortune",
    template: "%s · Cordelia",
  },
  description: "A chronological reading archive for an adult Diablo II alternate-universe fanfiction series.",
  openGraph: {
    title: "Cordelia and the Beneficent Misfortune",
    description: "A chronological Diablo II alternate-universe reading archive.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Cordelia — The Beneficent Misfortune",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cordelia and the Beneficent Misfortune",
    description: "A chronological Diablo II alternate-universe reading archive.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="night" data-reader-size="comfortable">
      <body>{children}</body>
    </html>
  );
}
