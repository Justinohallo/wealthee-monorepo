'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ReactNode } from "react";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ResponsiveTabsClientProps {
  positionsContent: ReactNode;
  activitiesContent: ReactNode;
  ordersContent: ReactNode;
  accountBalances: ReactNode;
}

/**
 * Client component for responsive account page layout
 * Uses tabs on mobile and a grid layout on desktop
 */
export function ResponsiveTabsClient({
  positionsContent,
  activitiesContent,
  ordersContent,
  accountBalances
}: ResponsiveTabsClientProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    return (
      <Tabs defaultValue="positions">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="positions" className="min-h-[44px] py-2">Positions</TabsTrigger>
          <TabsTrigger value="activities" className="min-h-[44px] py-2">Activities</TabsTrigger>
          <TabsTrigger value="orders" className="min-h-[44px] py-2">Orders</TabsTrigger>
          <TabsTrigger value="balances" className="min-h-[44px] py-2">Balances</TabsTrigger>
        </TabsList>
        <TabsContent value="positions">{positionsContent}</TabsContent>
        <TabsContent value="activities">{activitiesContent}</TabsContent>
        <TabsContent value="orders">{ordersContent}</TabsContent>
        <TabsContent value="balances">{accountBalances}</TabsContent>
      </Tabs>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Positions */}
      {positionsContent}

      {/* Activities and Orders in a 2-column grid */}
      <ResponsiveGrid xs={1} lg={2} spacing="md">
        {activitiesContent}
        {ordersContent}
        {accountBalances}
      </ResponsiveGrid>
    </div>
  );
}
