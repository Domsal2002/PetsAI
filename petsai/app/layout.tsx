import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PetsAI",
  description: "Generate amazing images of your pets with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        {/* Global Header */}
        <header className="bg-white shadow-md py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">PetsAI</h1>
            {/* Future navigation items can be added here */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <footer className="bg-white shadow-inner py-3 px-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PetsAI. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
