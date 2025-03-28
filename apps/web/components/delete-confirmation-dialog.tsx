"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";

import { useState } from "react";

interface DeleteResult {
  success: boolean;
  error?: string;
}

interface DeleteConfirmationDialogProps {
  title: string;
  description: string;
  onDelete: () => Promise<DeleteResult | void>;
  trigger?: React.ReactNode;
  buttonVariant?: ButtonProps["variant"];
  buttonSize?: ButtonProps["size"];
  buttonText?: string;
  buttonClassName?: string;
  isDisabled?: boolean;
}

export function DeleteConfirmationDialog({
  title,
  description,
  onDelete,
  trigger,
  buttonVariant = "destructive",
  buttonSize = "sm",
  buttonText = "Delete",
  buttonClassName,
  isDisabled = false,
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await onDelete();

      // Check if result is a DeleteResult object with success property
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          setIsOpen(false); // Only close on success
        } else if (result.error) {
          setError(result.error);
        } else {
          setError("Delete operation failed");
        }
      } else {
        // For backward compatibility with functions that return void
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Delete operation failed:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      // Only allow changing open state if we're not in the middle of deleting
      if (!isDeleting) {
        setIsOpen(open);
        if (!open) {
          setError(null);
        }
      }
    }}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant={buttonVariant}
            size={buttonSize}
            disabled={isDisabled}
            className={buttonClassName}
          >
            {buttonText}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
