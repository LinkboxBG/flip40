import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { Black_Han_Sans, DM_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./scanner-cursor.css";

const fontDisplay = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const fontBody = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const fontUI = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "FLIP40.COM | Strategic Asset Evaluation Engine",
  description:
    "Evaluate, validate, and flip online businesses with precision. Built by Ivan Kolev.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "FLIP40.COM | Strategic Asset Evaluation Engine",
    description: "The ultimate tool for building and flipping digital assets.",
    url: SITE_URL,
    siteName: "FLIP40.COM",
    images: [
      {
        url: "/assets/logo/flip40-logo-on-dark.webp",
        width: 1308,
        height: 382,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FLIP40.COM | Strategic Asset Evaluation Engine",
    description: "Evaluate, validate, and flip online businesses.",
    images: ["/assets/logo/flip40-logo-on-dark.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: "#0a0c10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontUI.variable} h-full overflow-x-hidden antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "FLIP40.COM",
              applicationCategory: "BusinessApplication",
              description:
                "Strategic engine for evaluating and flipping online business assets.",
              author: {
                "@type": "Person",
                name: "Ivan Kolev",
              },
            }),
          }}
        />
      </head>
      <body className="scanner-cursor flex min-h-screen flex-col overflow-x-hidden bg-bg-base font-body text-body-md text-text-primary">
        {children}
      </body>
    </html>
  );
}
