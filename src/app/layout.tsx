import { Toaster } from "@/components/ui/shadcn/toaster";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Ordering App",
  description: "Authentic Italian Food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <div id="modal" />
        <Toaster />
      </body>
    </html>
  );
}
