import * as React from "react";
import { ActivityIndicator, Platform, Pressable } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Text, TextClassContext } from "@/components/ui/text";

const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2.5 rounded-xl shadow-none",
    Platform.select({
      web: "whitespace-nowrap outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    }),
  ),
  {
    variants: {
      variant: {
        default: "bg-primary border border-primary active:opacity-90 shadow-sm",
        secondary: "bg-surface-container border border-border active:opacity-85 shadow-sm",
        outline: "border border-border bg-transparent active:bg-surface-container-low",
        ghost: "bg-transparent active:bg-surface-container-low",
        destructive: "bg-danger/10 border border-danger/30 active:opacity-85",
        link: "bg-transparent",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-9 px-3 rounded-lg gap-2",
        lg: "h-14 px-6 rounded-2xl gap-3",
        icon: "h-11 w-11 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-base font-semibold leading-none", {
  variants: {
    variant: {
      default: "text-primary-foreground font-bold",
      secondary: "text-primary font-medium",
      outline: "text-primary font-medium",
      ghost: "text-on-surface-variant font-medium",
      destructive: "text-danger font-semibold",
      link: "text-primary underline",
    },
    size: {
      default: "text-base",
      sm: "text-xs",
      lg: "text-lg",
      icon: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonBaseProps = React.ComponentPropsWithoutRef<typeof Pressable>;

export interface ButtonProps extends ButtonBaseProps, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      className,
      textClassName,
      variant = "default",
      size = "default",
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = (disabled ?? false) || (loading ?? false);
    const textContextValue = React.useMemo(
      () => cn(buttonTextVariants({ variant, size }), textClassName),
      [variant, size, textClassName],
    );

    return (
      <TextClassContext.Provider value={textContextValue}>
        <Pressable
          ref={ref}
          role="button"
          disabled={isDisabled}
          className={cn(buttonVariants({ variant, size }), isDisabled && "opacity-50", className)}
          {...props}
        >
          {loading ? (
            <ActivityIndicator size="small" color={variant === "default" ? "#09090b" : "#ffffff"} />
          ) : typeof children === "string" ? (
            <Text className={textClassName}>{children}</Text>
          ) : (
            children
          )}
        </Pressable>
      </TextClassContext.Provider>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants, buttonTextVariants };
