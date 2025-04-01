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

interface ConfirmationResult {
  success: boolean;
  error?: string;
}

interface ConfirmationDialogProps {
  title: string;
  description: string;
  onConfirm: () => Promise<ConfirmationResult | void>;
  trigger?: React.ReactNode;
  buttonVariant?: ButtonProps["variant"];
  buttonSize?: ButtonProps["size"];
  buttonText?: string;
  buttonClassName?: string;
  isDisabled?: boolean;
  confirmText?: string;
}

export function ConfirmationDialog({
  title,
  description,
  onConfirm,
  trigger,
  buttonVariant = "destructive",
  buttonSize = "sm",
  buttonText = "Confirm",
  buttonClassName,
  isDisabled = false,
  confirmText = "Confirm",
}: ConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await onConfirm();

      // Check if result is a ConfirmationResult object with success property
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          setIsOpen(false); // Only close on success
        } else if (result.error) {
          setError(result.error);
        } else {
          setError("Operation failed");
        }
      } else {
        // For backward compatibility with functions that return void
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Operation failed:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      // Only allow changing open state if we're not in the middle of processing
      if (!isProcessing) {
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
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
