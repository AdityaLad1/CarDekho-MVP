import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CarDekho-MVP",
  description: "AI car recommendation app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}