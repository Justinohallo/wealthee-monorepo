// Adapted from shadcn/ui toast component
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"

import {
    useToast as useToastOriginal,
} from "@/components/ui/toast"

export type ToastVariant = NonNullable<ToastProps["variant"]>

export interface ToastState {
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
    variant?: ToastVariant
}

export const useToast = useToastOriginal

export { Toast, ToastActionElement, ToastProps }
