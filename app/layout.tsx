import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandForge MVP",
  description: "Pipeline transparente de agentes para geração criativa de campanhas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
