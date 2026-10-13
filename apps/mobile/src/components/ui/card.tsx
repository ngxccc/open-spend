import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./text";

function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "bg-surface-container-low rounded-2xl p-5 border border-border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ViewProps) {
  return (
    <View className={cn("flex-row items-center justify-between mb-3", className)} {...props} />
  );
}

function CardTitle({ className, children, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text variant="h3" className={cn("text-primary", className)} {...props}>
      {children}
    </Text>
  );
}

function CardDescription({ className, children, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text variant="subtext" className={cn("text-on-surface-variant", className)} {...props}>
      {children}
    </Text>
  );
}

function CardContent({ className, ...props }: ViewProps) {
  return <View className={cn("", className)} {...props} />;
}

function CardFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-between mt-4 pt-3 border-t border-border/60",
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
