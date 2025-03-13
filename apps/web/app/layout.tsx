import "../styles/globals.css"

import { AuthProvider } from "@/contexts/AuthContext"
import Footer from "@/app/_components/Footer"
import Navbar from "@/app/_components/Navbar"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { inter } from "@/styles/fonts"
import { theme } from "@/styles/theme"

export const metadata = {
  title: "Wealthee - Empowering Portfolio Management",
  description: "Revolutionizing financial services with expert portfolio management and copy-trading",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.className} flex flex-col min-h-screen`}
        style={{ color: theme.black, backgroundColor: theme.white }}
      >
        <AuthProvider>
          <Navbar />
          <div className="flex-grow pt-16">
            {modal}
            {children}
          </div>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



