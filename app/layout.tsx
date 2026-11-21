import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: {
    default: "Shaligram Labs — Foundations for autonomy",
    template: "%s · Shaligram Labs",
  },
  description:
    "Shaligram Labs, Kathmandu. Tools and infrastructure for agents, starting with Reify.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      {
        url: "/favicon.ico",
        sizes: "16x16 32x32 48x48 64x64",
        type: "image/x-icon",
      },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
