"use client";

import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { deleteBrokerageConnection } from "@/services/snaptrade/connections";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface DeleteBrokerageConnectionButtonProps {
  idToken: string;
  snapTradeUserId: string;
  brokerageId: string;
  brokerageName: string; // Changed to any to bypass TypeScript checks
  redirectUrl?: string; // URL to redirect to after successful deletion
}



export function DeleteBrokerageConnectionButton({
  idToken,
  snapTradeUserId,
  brokerageId,
  brokerageName = "this brokerage",
  redirectUrl,
}: DeleteBrokerageConnectionButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Ensure brokerageName is actually a string
  const displayName = typeof brokerageName === 'string'
    ? brokerageName
    : "this brokerage";

  const handleDelete = async () => {
    try {
      const result = await deleteBrokerageConnection(
        snapTradeUserId,
        brokerageId,
        idToken
      );

      if (result.success) {
        toast({
          title: "Brokerage connection deleted",
          description: `Connection to "${displayName}" has been successfully removed.`,
        });

        // Navigate to redirectUrl if provided, otherwise refresh the current page
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.refresh();
        }

        return { success: true };
      } else {
        toast({
          title: "Failed to delete connection",
          description: "An error occurred while deleting the brokerage connection. Please try again.",
          variant: "destructive",
        });
        return { success: false, error: "Failed to delete brokerage connection" };
      }
    } catch (error) {
      console.error("Error deleting brokerage connection:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  return (
    <DeleteConfirmationDialog
      title="Delete Brokerage Connection"
      description={`Are you sure you want to delete the connection to "${displayName}"? This action cannot be undone and will remove access to all accounts linked to this brokerage.`}
      onDelete={handleDelete}
      buttonText="Delete"
      buttonVariant="destructive"
      buttonSize="sm"
    />
  );
}
