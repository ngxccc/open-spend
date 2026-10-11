import { type StyleProp, Text, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertCircle, CheckCircle, Info } from "lucide-react-native";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info";
export type ToastPosition = "top-right" | "top-center" | "bottom-center";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "right-5",
  "top-center": "self-center",
  "bottom-center": "self-center",
};

const iconConfig: Record<ToastVariant, { color: string; Icon: typeof CheckCircle }> = {
  success: {
    color: "#34D399",
    Icon: CheckCircle,
  },
  error: {
    color: "#F87171",
    Icon: AlertCircle,
  },
  info: {
    color: "#A1A1AA",
    Icon: Info,
  },
};

export function Toast({
  message,
  variant = "success",
  position = "top-center",
  className,
  style,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const { color, Icon } = iconConfig[variant];

  const isTop = position.startsWith("top");
  const edgeStyle: ViewStyle = isTop
    ? { top: Math.max(insets.top, 16) + 12 }
    : { bottom: Math.max(insets.bottom, 16) + 12 };

  return (
    <View
      style={[edgeStyle, style]}
      className={cn(
        "absolute z-50 flex-row items-center gap-3 rounded-xl px-4 py-3",
        "bg-surface-container border border-border shadow-xl shadow-black/60",
        "max-w-[340px]",
        positionClasses[position],
        className,
      )}
    >
      <View className="shrink-0">
        <Icon size={18} color={color} />
      </View>
      <Text numberOfLines={2} className="text-sm font-semibold text-primary leading-snug shrink">
        {message}
      </Text>
    </View>
  );
}

export default Toast;
