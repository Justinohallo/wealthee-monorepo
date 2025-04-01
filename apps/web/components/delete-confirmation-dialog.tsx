"use client";

/**
 * This file is provided for backward compatibility.
 * New code should use ConfirmationDialog from @/components/confirmation-dialog.tsx
 */

import { ConfirmationDialog } from "./confirmation-dialog";

export interface DeleteConfirmationDialogProps {
  title: string;
  description: string;
  onDelete: () => Promise<any>;
  trigger?: React.ReactNode;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
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
  return (
    <ConfirmationDialog
      title={title}
      description={description}
      onConfirm={onDelete}
      trigger={trigger}
      buttonVariant={buttonVariant}
      buttonSize={buttonSize}
      buttonText={buttonText}
      buttonClassName={buttonClassName}
      isDisabled={isDisabled}
      confirmText="Delete"
    />
  );
}
