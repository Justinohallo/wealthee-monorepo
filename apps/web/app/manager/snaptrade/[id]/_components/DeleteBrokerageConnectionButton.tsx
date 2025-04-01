"use client";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { deleteBrokerageConnection } from "@/services/snaptrade/connections";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface DeleteBrokerageConnectionButtonProps {
  snapTradeUserId: string;
  brokerageId: string;
  brokerageName: string;
  idToken: string;
  redirectUrl?: string;
  buttonClassName?: string;
}

export function DeleteBrokerageConnectionButton({
  idToken,
  snapTradeUserId,
  brokerageId,
  brokerageName,
  redirectUrl,
  buttonClassName,
}: DeleteBrokerageConnectionButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Ensure brokerage name is a string
  const displayName = String(brokerageName);

  const handleDelete = async () => {
    try {
      await deleteBrokerageConnection(
        snapTradeUserId,
        brokerageId,
        idToken
      );

      toast({
        title: "Connection deleted",
        description: `Successfully deleted connection to ${displayName}.`,
      });

      // Redirect if URL is provided, otherwise refresh
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.refresh();
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting brokerage connection:", error);

      toast({
        title: "Error",
        description: "Failed to delete the brokerage connection.",
        variant: "destructive",
      });

      return {
        success: false,
        error: "Failed to delete the brokerage connection"
      };
    }
  };

  return (
    <ConfirmationDialog
      title="Delete Connection"
      description={`Are you sure you want to delete the connection to ${displayName}? This action cannot be undone.`}
      onConfirm={handleDelete}
      buttonVariant="destructive"
      buttonText="Delete"
      buttonClassName={buttonClassName}
      confirmText="Delete"
    />
  );
}
