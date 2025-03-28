import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { ResponsiveTable, type Column } from "@/components/ui/responsive-table";
import { StatsGrid } from "@/components/ui/stats-grid";
import { ResponsiveAccountSummary } from "@/components/account/responsive-account-summary";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BarChart3, DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react";

// Example data for demonstration
const mockAccount = {
  id: "acc12345",
  name: "TFSA Investment Account",
  number: "12345678",
  institution_name: "TD Direct Investing",
  status: "Open",
  balance: {
    totalValue: 43250.75,
    cash: 5280.42,
    investments: 37970.33,
    buyingPower: 5280.42
  },
  meta: {
    type: "Tax-Free Savings Account",
    status: "open" as "open" | "closed"
  },
  currency: "CAD"
};

const mockHoldings = [
  { id: "h1", name: "Apple Inc.", symbol: "AAPL", quantity: 25, price: 174.82, marketValue: 4370.50, change: 2.5 },
  { id: "h2", name: "Microsoft Corporation", symbol: "MSFT", quantity: 12, price: 367.45, marketValue: 4409.40, change: -0.8 },
  { id: "h3", name: "Amazon.com Inc.", symbol: "AMZN", quantity: 18, price: 128.95, marketValue: 2321.10, change: 1.2 },
  { id: "h4", name: "Tesla Inc.", symbol: "TSLA", quantity: 10, price: 246.53, marketValue: 2465.30, change: -1.5 },
  { id: "h5", name: "NVIDIA Corporation", symbol: "NVDA", quantity: 8, price: 477.76, marketValue: 3822.08, change: 3.7 }
];

const holdingsColumns: Column[] = [
  { key: "name", label: "Name" },
  { key: "symbol", label: "Symbol" },
  { key: "quantity", label: "Quantity" },
  {
    key: "price",
    label: "Price",
    render: (value) => `$${value.toFixed(2)}`
  },
  {
    key: "marketValue",
    label: "Market Value",
    render: (value) => `$${value.toFixed(2)}`,
    className: "text-right"
  },
  {
    key: "change",
    label: "Change",
    render: (value) => (
      <div className={`flex items-center justify-end ${value > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {value > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {Math.abs(value)}%
      </div>
    ),
    className: "text-right"
  }
];

const mockStats = [
  {
    label: "Total Portfolio Value",
    value: "$43,250.75",
    change: 1.8,
    icon: <DollarSign className="h-8 w-8" />
  },
  {
    label: "Open Positions",
    value: "12",
    icon: <BarChart3 className="h-8 w-8" />
  },
  {
    label: "Average Return",
    value: "8.2%",
    change: 0.5,
    icon: <ArrowUpDown className="h-8 w-8" />
  },
  {
    label: "Connections",
    value: "3",
    changeLabel: "Last added 3 days ago",
    icon: <Users className="h-8 w-8" />
  }
];

/**
 * Example component demonstrating the responsive components
 * Use this as a reference when implementing mobile-first UI
 */
export function MobileDesignGuideExample() {
  return (
    <ResponsiveContainer className="py-6">
      <h1 className="text-2xl font-bold mb-4">Mobile-First Design Implementation</h1>
      <p className="text-muted-foreground mb-8">
        This example demonstrates the responsive components using mobile-first design principles.
        Resize your browser to see how the layout adapts to different screen sizes.
      </p>

      <Separator className="my-8" />

      {/* Account Summary Example */}
      <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
      <ResponsiveAccountSummary account={mockAccount} className="mb-8" />

      {/* Stats Grid Example */}
      <h2 className="text-xl font-semibold mb-4">Portfolio Dashboard</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Summary of your financial position</CardDescription>
        </CardHeader>
        <CardContent>
          <StatsGrid stats={mockStats} />
        </CardContent>
      </Card>

      {/* Responsive Table Example */}
      <h2 className="text-xl font-semibold mb-4">Holdings Table</h2>
      <Card className="mb-8">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Current Holdings</CardTitle>
            <CardDescription>Your investment positions</CardDescription>
          </div>
          <Button className="mt-4 md:mt-0">View All Holdings</Button>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            data={mockHoldings}
            columns={holdingsColumns}
            emptyMessage="No holdings found"
          />
        </CardContent>
      </Card>

      {/* Responsive Grid Example */}
      <h2 className="text-xl font-semibold mb-4">Responsive Grids</h2>
      <ResponsiveGrid xs={1} sm={2} md={3} lg={4} spacing="md" className="mb-8">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Card key={idx} className="p-4">
            <h3 className="font-medium">Grid Item {idx + 1}</h3>
            <p className="text-sm text-muted-foreground">
              This grid automatically adjusts columns based on screen size.
            </p>
          </Card>
        ))}
      </ResponsiveGrid>
    </ResponsiveContainer>
  );
}
