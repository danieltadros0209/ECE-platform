import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECE Stipend Application",
  description: "Early Childhood Education stipend application",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className="min-vh-100 bg-light">{children}</body>
    </html>
  );
};

export default RootLayout;
