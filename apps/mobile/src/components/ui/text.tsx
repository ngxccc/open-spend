import { cn } from "@/lib/utils";
import { Slot } from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, Text as RNText, type Role } from "react-native";

/**
 * OpenSpend Typography System
 * Standardized scale ensuring consistent hierarchy across Auth and Dashboard.
 *
 * Scales:
 * - display: 32px / font-extrabold / tracking-tight (Large metrics / Balance)
 * - h1: 28px / font-extrabold / tracking-tight (Screen Hero titles)
 * - h2: 22px / font-bold / tracking-tight (Section / Card headers)
 * - h3: 18px / font-bold / tracking-tight (Sub-card titles)
 * - h4: 16px / font-semibold (Item list titles)
 * - body: 15px / font-normal / leading-relaxed (Standard content)
 * - bodyMedium: 15px / font-medium (Emphasized content)
 * - bodySemi: 15px / font-semibold (Compact headers / numbers)
 * - subtext: 13px / font-normal (Descriptions / subtitles)
 * - subtextMedium: 13px / font-medium (Badges / chips)
 * - caption: 12px / font-normal (Timestamps / meta notes)
 * - captionMedium: 12px / font-medium (Button subtext / small labels)
 */
const textVariants = cva(
  cn(
    "text-on-surface",
    Platform.select({
      web: "select-text",
    }),
  ),
  {
    variants: {
      variant: {
        default: "text-[15px] font-normal leading-6 text-on-surface",
        display: "text-[32px] font-extrabold tracking-tight text-primary leading-tight",
        h1: "text-[26px] font-extrabold tracking-tight text-primary leading-8",
        h2: "text-[20px] font-bold tracking-tight text-primary leading-7",
        h3: "text-[18px] font-bold tracking-tight text-primary leading-6",
        h4: "text-[16px] font-semibold text-primary leading-6",
        body: "text-[15px] font-normal text-on-surface leading-6",
        bodyMedium: "text-[15px] font-medium text-on-surface leading-6",
        bodySemi: "text-[15px] font-semibold text-on-surface leading-6",
        subtext: "text-[13px] font-normal text-on-surface-variant leading-5",
        subtextMedium: "text-[13px] font-medium text-on-surface-variant leading-5",
        caption: "text-[12px] font-normal text-on-surface-variant leading-4",
        captionMedium: "text-[12px] font-medium text-on-surface-variant leading-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps["variant"]>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  display: "heading",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  display: "1",
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = "default",
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
    maxFontSizeMultiplier?: number;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? 1.25}
      {...props}
    />
  );
}

export { Text, TextClassContext };
