import type { Metadata } from "next";
import "./globals.css";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: env.appName,
  description: "Optimiza tu CV y sigue tus procesos de selección.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
