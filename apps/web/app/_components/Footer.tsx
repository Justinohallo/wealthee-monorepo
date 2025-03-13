import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

import Link from "next/link"
import { theme } from "@/styles/theme"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: theme.textBlue }}>
              Wealthee
            </h3>
            <p className="text-gray-400 mb-4">
              Revolutionizing financial services with expert portfolio management and copy-trading.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.textBlue }}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.textBlue }}>
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio-management" className="text-gray-400 hover:text-white transition-colors">
                  Portfolio Management
                </Link>
              </li>
              <li>
                <Link href="/copy-trading" className="text-gray-400 hover:text-white transition-colors">
                  Copy Trading
                </Link>
              </li>
              <li>
                <Link href="/wealth-management" className="text-gray-400 hover:text-white transition-colors">
                  Wealth Management
                </Link>
              </li>
              <li>
                <Link href="/financial-planning" className="text-gray-400 hover:text-white transition-colors">
                  Financial Planning
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.textBlue }}>
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Wealthee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
