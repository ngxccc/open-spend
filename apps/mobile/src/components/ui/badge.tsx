import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Text } from "./text";

const badgeVariants = cva("flex-row items-center gap-1.5 px-3 py-1 rounded-full border", {
  variants: {
    variant: {
      default: "bg-surface-container-high border-border-subtle",
      warning: "bg-amber-500/10 border-amber-500/30",
      success: "bg-emerald-500/10 border-emerald-500/30",
      danger: "bg-rose-500/10 border-rose-500/30",
      outline: "border-border bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const badgeTextVariants = cva("font-medium", {
  variants: {
    variant: {
      default: "text-on-surface-secondary",
      warning: "text-amber-500 font-semibold",
      success: "text-emerald-400 font-semibold",
      danger: "text-rose-400 font-semibold",
      outline: "text-on-surface-variant",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BadgeProps = ViewProps &
  VariantProps<typeof badgeVariants> & {
    label?: string;
    children?: React.ReactNode;
  };

function Badge({ className, variant, label, children, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      {label ? (
        <Text variant="captionMedium" className={badgeTextVariants({ variant })}>
          {label}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

export { Badge, badgeVariants };
