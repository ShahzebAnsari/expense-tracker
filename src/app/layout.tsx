import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ledger — Daily Expense Tracker",
  description:
    "A simple, local-first daily expense tracker. No backend, no sign-up — your data stays in your browser.",
};

export const viewport: Viewport = {
  themeColor: "#0a0c11",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
