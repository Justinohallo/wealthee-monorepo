"use client";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { deleteSnapTradeUser } from "@/services/snaptrade/users";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface DeleteUserButtonProps {
  portfolioManagerId: string;
  snapTradeUserId: string;
  userName: string;
  idToken: string;
  buttonClassName?: string;
}

export function DeleteUserButton({
  portfolioManagerId,
  snapTradeUserId,
  userName,
  idToken,
  buttonClassName,
}: DeleteUserButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await deleteSnapTradeUser({
        idToken,
        portfolioManagerId,
        snapTradeUserId,
      });

      if (response.success) {
        toast({
          title: "User deleted",
          description: `Successfully deleted SnapTrade user ${userName}.`,
        });

        // Redirect to the users list
        router.push("/manager/snaptrade/@users");
        return { success: true };
      } else {
        toast({
          title: "Error deleting user",
          description: "Failed to delete the user. Please try again.",
          variant: "destructive",
        });
        return { success: false, error: "Delete operation failed" };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  return (
    <ConfirmationDialog
      title="Delete SnapTrade User"
      description={`Are you sure you want to delete the SnapTrade user "${userName}"? This will permanently remove all connected brokerages and data. This action cannot be undone.`}
      onConfirm={handleDelete}
      buttonVariant="destructive"
      buttonText="Delete User"
      buttonClassName={buttonClassName}
      confirmText="Delete"
    />
  );
}
