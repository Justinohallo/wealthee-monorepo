"use client"

import DashboardPreview from "@/app/_components/DashboardPreview"
import { theme } from "@/styles/theme"
import { useState } from "react"

export default function Hero() {
  const [email, setEmail] = useState("")

  return (
    <section
      className="relative min-h-screen pt-16 md:pt-20 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${theme.primaryLight}, ${theme.primary})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Manage wealth,
            <br />
            anywhere
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Portfolio management & copy-trading platform for professional managers. Seamlessly manage client investments
            worldwide.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-white w-full mb-2 sm:mb-0"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            />
            <button
              className="px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
              style={{ backgroundColor: theme.textBlue }}
            >
              Get early access
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-2">Join our waitlist to receive early access to Wealthee.</p>
        </div>

        <DashboardPreview />

        <div className="mt-20 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Portfolio Management",
                description:
                  "Professional tools for managing multiple client portfolios with advanced analytics and reporting.",
              },
              {
                title: "Copy Trading",
                description:
                  "Enable clients to automatically replicate your successful trading strategies in real-time.",
              },
              {
                title: "Client Communication",
                description: "Built-in messaging and blogging platform to keep your clients informed and engaged.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl backdrop-blur-sm"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
              >
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
