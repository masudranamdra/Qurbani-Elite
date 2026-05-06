import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Qurbani Livestock Marketplace | Premium Animals for Sacrifice",
  description: "Browse and book the healthiest cows and goats for your Qurbani. Direct from the farm to your doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

