import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

/**
 * A responsive container with appropriate padding at different breakpoints
 *
 * @param children - The content to display within the container
 * @param className - Additional classes to apply to the container
 * @param fluid - If true, the container will have no max-width and fill the full width
 */
export function ResponsiveContainer({
  children,
  className,
  fluid = false,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "w-full px-4 sm:px-6 md:px-8",
        !fluid && "max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
