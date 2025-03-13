"use client"

import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { theme } from "@/styles/theme"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface BaseLink {
  id: number
  href: string
  label: string
}

interface ClickableLink extends BaseLink {
  onClick: () => Promise<void>
}

type NavLink = BaseLink | ClickableLink

function isClickableLink(link: NavLink): link is ClickableLink {
  return 'onClick' in link
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, userRole } = useAuth()
  const router = useRouter()

  const links: NavLink[] = [
    { id: 1, href: "/", label: "Home" },
    { id: 2, href: "/contact", label: "Contact" },
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
      console.log("User logged out successfully")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const getDashboardLink = (): NavLink | undefined => {
    if (!user || !userRole) return undefined
    switch (userRole) {
      case "admin":
        return { id: 3, href: "/admin", label: "Dashboard" }
      case "portfolioManager":
        return { id: 4, href: "/manager", label: "Dashboard" }
      case "client":
        return { id: 5, href: "/client", label: "Dashboard" }
      default:
        return undefined
    }
  }

  const dashboardLink = getDashboardLink()

  const authLinks: NavLink[] = user
    ? [
      ...(dashboardLink ? [dashboardLink] : []),
      { id: 6, href: "#", label: "Logout", onClick: handleLogout }
    ].filter(Boolean)
    : [
      { id: 7, href: "/login", label: "Login" },
      { id: 8, href: "/signup", label: "Sign up" },
    ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
      document.documentElement.classList.add("scroll-smooth")
    } else {
      document.body.style.overflow = "unset"
      document.documentElement.classList.remove("scroll-smooth")
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 h-16" style={{ backgroundColor: theme.primary }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="Wealthee Logo" width={32} height={32} className="mr-2" />
          <span className="text-white text-2xl font-bold">Wealthee</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          {authLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={async (e) => {
                if (isClickableLink(link)) {
                  e.preventDefault()
                  await link.onClick()
                }
              }}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden text-white p-0 hover:bg-transparent" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isMenuOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg overflow-y-auto transition-all duration-300 ease-in-out ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        style={{ backgroundColor: theme.backgroundBlue }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-2xl font-bold" style={{ color: theme.primary }} onClick={toggleMenu}>
              Wealthee
            </Link>
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={toggleMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="space-y-6">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="flex items-center justify-between text-lg font-medium hover:text-blue-600 transition-colors duration-200"
                style={{ color: theme.primary }}
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
            <Separator className="my-6" />
            {authLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={async (e) => {
                  if (isClickableLink(link)) {
                    e.preventDefault()
                    await link.onClick()
                  }
                  toggleMenu()
                }}
                className="flex items-center justify-between text-lg font-medium hover:text-blue-600 transition-colors duration-200"
                style={{ color: theme.primary }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  )
}
