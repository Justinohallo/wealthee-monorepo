'use client'

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { setPrimaryAccount } from "@/services/portfolioManager/primaryAccount";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface SetPrimaryAccountButtonProps {
  snapTradeUserId: string;
  accountId: string;
  accountName: string;
  isPrimary: boolean;
  idToken: string;
  portfolioManagerId: string;
  variant?: "default" | "outline" | "secondary";
}

export function SetPrimaryAccountButton({
  accountId,
  accountName,
  isPrimary,
  idToken,
  portfolioManagerId,
  variant = "outline"
}: SetPrimaryAccountButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleSetPrimary = async () => {
    try {
      await setPrimaryAccount({
        portfolioManagerId,
        accountId,
        idToken,
      });

      toast({
        title: "Primary account updated",
        description: `${accountName} is now set as the primary account.`,
      });

      router.refresh();
      return { success: true };
    } catch (error) {
      toast({
        title: "Error setting primary account",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "Failed to set primary account" };
    }
  };

  // If the account is already primary, just show a badge
  if (isPrimary) {
    return (
      <Button size="sm" disabled>
        <CheckCircle className="mr-1 h-4 w-full" />
        Primary
      </Button>
    );
  }

  // Otherwise show the confirmation dialog with a trigger button
  return (
    <ConfirmationDialog
      title="Set Primary Account"
      description={`Are you sure you want to set ${accountName} as the primary account? The primary account will be used for portfolio reporting and trading.`}
      onConfirm={handleSetPrimary}
      buttonVariant={variant}
      buttonSize="sm"
      buttonText="Set as Primary"
      confirmText="Set Primary"
    />
  );
}
