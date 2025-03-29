'use client';

import { AccountPositionsTable } from "@/app/manager/snaptrade/[id]/account/[accountId]/_components/AccountPositionsTable";
import { AccountActivitiesTable } from "@/app/manager/snaptrade/[id]/account/[accountId]/_components/AccountActivitiesTable";
import { AccountOrdersTable } from "@/app/manager/snaptrade/[id]/account/[accountId]/_components/AccountOrdersTable";
import { type Position, type PaginatedUniversalActivity, type Order, type SecurityType } from "@/types/snaptrade";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Mock data for positions
const MOCK_POSITIONS: Position[] = [
  {
    symbol: {
      symbol: {
        symbol: "AAPL",
        id: "aapl-id",
        raw_symbol: "AAPL",
        currency: { code: "USD" },
        type: "STOCK" as unknown as SecurityType,
        currencies: [{ code: "USD" }]
      }
    },
    units: 15,
    price: 182.63,
    open_pnl: 450.25,
    currency: {
      code: "USD"
    }
  },
  {
    symbol: {
      symbol: {
        symbol: "MSFT",
        id: "msft-id",
        raw_symbol: "MSFT",
        currency: { code: "USD" },
        type: "STOCK" as unknown as SecurityType,
        currencies: [{ code: "USD" }]
      }
    },
    units: 8,
    price: 415.28,
    open_pnl: -120.50,
    currency: {
      code: "USD"
    }
  },
  {
    symbol: {
      symbol: {
        symbol: "GOOGL",
        id: "googl-id",
        raw_symbol: "GOOGL",
        currency: { code: "USD" },
        type: "STOCK" as unknown as SecurityType,
        currencies: [{ code: "USD" }]
      }
    },
    units: 5,
    price: 161.92,
    open_pnl: 75.30,
    currency: {
      code: "USD"
    }
  },
  {
    symbol: {
      symbol: {
        symbol: "AMZN",
        id: "amzn-id",
        raw_symbol: "AMZN",
        currency: { code: "USD" },
        type: "STOCK" as unknown as SecurityType,
        currencies: [{ code: "USD" }]
      }
    },
    units: 10,
    price: 178.75,
    open_pnl: 230.40,
    currency: {
      code: "USD"
    }
  }
];

// Mock data for activities
const MOCK_ACTIVITIES: PaginatedUniversalActivity = {
  data: [
    {
      id: "act-1",
      account_id: "account-1",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      type: "DIVIDEND",
      description: "Dividend payment received",
      symbol: {
        symbol: "AAPL",
        id: "aapl-id",
        raw_symbol: "AAPL",
        description: "Apple Inc.",
        currency: { code: "USD" },
      },
      currency: { code: "USD" },
      amount: 32.50
    },
    {
      id: "act-2",
      account_id: "account-1",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      type: "BUY",
      description: "Purchased shares",
      symbol: {
        symbol: "MSFT",
        id: "msft-id",
        raw_symbol: "MSFT",
        description: "Microsoft Corporation",
        currency: { code: "USD" },
      },
      currency: { code: "USD" },
      amount: -3322.24
    },
    {
      id: "act-3",
      account_id: "account-1",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      type: "SELL",
      description: "Sold shares",
      symbol: {
        symbol: "TSLA",
        id: "tsla-id",
        raw_symbol: "TSLA",
        description: "Tesla Inc.",
        currency: { code: "USD" },
      },
      currency: { code: "USD" },
      amount: 2450.75
    },
    {
      id: "act-4",
      account_id: "account-1",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      type: "DEPOSIT",
      description: "Cash deposit",
      currency: { code: "USD" },
      amount: 5000.00
    },
    {
      id: "act-5",
      account_id: "account-1",
      date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      type: "FEE",
      description: "Monthly account fee",
      currency: { code: "USD" },
      amount: -9.99
    }
  ]
};

// Mock data for orders
const MOCK_ORDERS: Order[] = [
  {
    brokerage_order_id: "order-1",
    symbol: "AAPL",
    order_type: "MARKET",
    action: "BUY",
    total_quantity: 10,
    open_quantity: 0,
    canceled_quantity: 0,
    filled_quantity: 10,
    status: "EXECUTED",
    time_in_force: "DAY",
    time_placed: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    brokerage_order_id: "order-2",
    symbol: "MSFT",
    order_type: "LIMIT",
    action: "BUY",
    total_quantity: 5,
    open_quantity: 5,
    canceled_quantity: 0,
    filled_quantity: 0,
    status: "PENDING",
    time_in_force: "DAY",
    time_placed: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    brokerage_order_id: "order-3",
    symbol: "TSLA",
    order_type: "MARKET",
    action: "SELL",
    total_quantity: 8,
    open_quantity: 0,
    canceled_quantity: 0,
    filled_quantity: 8,
    status: "EXECUTED",
    time_in_force: "DAY",
    time_placed: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
  {
    brokerage_order_id: "order-4",
    symbol: "AMZN",
    order_type: "LIMIT",
    action: "BUY",
    total_quantity: 3,
    open_quantity: 0,
    canceled_quantity: 3,
    filled_quantity: 0,
    status: "REJECTED",
    time_in_force: "DAY",
    time_placed: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  }
];

// Table of contents sections
const SECTIONS = [
  { id: "positions", label: "Account Positions" },
  { id: "activities", label: "Account Activities" },
  { id: "orders", label: "Account Orders" },
  { id: "loading", label: "Loading States" },
  { id: "empty", label: "Empty States" }
];

type ViewportSize = "mobile" | "tablet" | "desktop";

const VIEWPORT_SIZES = {
  mobile: { width: 375, label: "Mobile (375px)" },
  tablet: { width: 768, label: "Tablet (768px)" },
  desktop: { width: 1024, label: "Desktop (1024px)" }
};

export default function ComponentShowcasePage() {
  const [activeSection, setActiveSection] = useState<string>("positions");
  const [viewportSize, setViewportSize] = useState<ViewportSize>("mobile");

  return (
    <div className="container py-8">
      <div className="border-b pb-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Component Showcase</h1>
        <p className="text-muted-foreground mt-2">
          This private page displays our responsive components with mock data
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar with TOC */}
        <div className="w-full lg:w-64 flex-shrink-0 md:sticky md:top-4 self-start">
          <div className="p-4 border rounded-lg bg-background">
            <h3 className="font-medium mb-3">Table of Contents</h3>
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start"
                    });
                  }}
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* View Mode Selector */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold">Component Preview</h2>
            <div className="flex space-x-2">
              {Object.entries(VIEWPORT_SIZES).map(([size, config]) => (
                <Button
                  key={size}
                  variant={viewportSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewportSize(size as ViewportSize)}
                >
                  {config.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Responsive viewport frame */}
          <div className="border rounded-lg mx-auto overflow-hidden shadow-sm bg-background mb-8">
            <div className="border-b p-2 bg-muted/30 flex items-center gap-1.5">
              <div className="rounded-full w-3 h-3 bg-red-500"></div>
              <div className="rounded-full w-3 h-3 bg-yellow-500"></div>
              <div className="rounded-full w-3 h-3 bg-green-500"></div>
              <div className="mx-auto text-xs text-muted-foreground">
                {VIEWPORT_SIZES[viewportSize].label} Preview
              </div>
            </div>
            <div
              className="mx-auto h-[700px] overflow-y-auto p-4 transition-all duration-300"
              style={{
                width: "100%",
                maxWidth: `${VIEWPORT_SIZES[viewportSize].width}px`
              }}
            >
              {/* Components within the viewport */}
              <div className="space-y-12">
                <section id="positions" className="scroll-mt-4">
                  <h2 className="text-lg font-semibold mb-3">Account Positions</h2>
                  <AccountPositionsTable
                    positions={MOCK_POSITIONS}
                    isLoading={false}
                  />
                </section>

                <section id="activities" className="scroll-mt-4">
                  <h2 className="text-lg font-semibold mb-3">Account Activities</h2>
                  <AccountActivitiesTable
                    activities={MOCK_ACTIVITIES}
                    isLoading={false}
                  />
                </section>

                <section id="orders" className="scroll-mt-4">
                  <h2 className="text-lg font-semibold mb-3">Account Orders</h2>
                  <AccountOrdersTable
                    orders={MOCK_ORDERS}
                    isLoading={false}
                  />
                </section>

                <section id="loading" className="scroll-mt-4">
                  <h2 className="text-lg font-semibold mb-3">Loading States</h2>
                  <div className="space-y-6">
                    <AccountPositionsTable positions={[]} isLoading={true} />
                    <AccountActivitiesTable activities={{ data: [] }} isLoading={true} />
                    <AccountOrdersTable orders={[]} isLoading={true} />
                  </div>
                </section>

                <section id="empty" className="scroll-mt-4">
                  <h2 className="text-lg font-semibold mb-3">Empty States</h2>
                  <div className="space-y-6">
                    <AccountPositionsTable positions={[]} isLoading={false} />
                    <AccountActivitiesTable activities={{ data: [] }} isLoading={false} />
                    <AccountOrdersTable orders={[]} isLoading={false} />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
