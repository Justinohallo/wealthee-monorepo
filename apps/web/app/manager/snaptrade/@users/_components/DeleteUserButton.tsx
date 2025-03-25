"use client";

import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { deleteSnapTradeUser } from "@/services/snapTrade";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface DeleteUserButtonProps {
  idToken: string;
  portfolioManagerId: string;
  snapTradeUserId: string;
  displayName: string;
  redirectUrl?: string; // URL to redirect to after successful deletion
}

// Match the return type with DeleteConfirmationDialog
interface DeleteResult {
  success: boolean;
  error?: string;
}

export function DeleteUserButton({
  idToken,
  portfolioManagerId,
  snapTradeUserId,
  displayName,
  redirectUrl,
}: DeleteUserButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (): Promise<DeleteResult> => {
    try {
      const { success } = await deleteSnapTradeUser({
        idToken,
        portfolioManagerId,
        snapTradeUserId,
      });

      if (success) {
        toast({
          title: "User deleted successfully",
          description: `SnapTrade user "${displayName}" has been deleted.`,
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
          title: "Failed to delete user",
          description: "An error occurred while deleting the user. Please try again.",
          variant: "destructive",
        });
        return { success: false, error: "Failed to delete user" };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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
      title="Delete SnapTrade User"
      description={`Are you sure you want to delete "${displayName}"? This action cannot be undone and will remove all associated data from SnapTrade.`}
      onDelete={handleDelete}
      buttonText="Delete"
      buttonVariant="destructive"
      buttonSize="sm"
    />
  );
}
