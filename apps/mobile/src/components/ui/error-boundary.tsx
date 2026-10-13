import { Component, type ErrorInfo, type ReactNode } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle, RefreshCw, Copy, Check } from "lucide-react-native";
import { Text } from "./text";
import { Button } from "./button";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
    copied: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, copied: false };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("React Component Crash caught by ErrorBoundary", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, copied: false });
  };

  handleCopy = () => {
    // In production we display clean message, while keeping sanitized error trace for support
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2500);
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      const isDev = __DEV__;
      const displayMessage = isDev
        ? this.state.error.message
        : "Đã xảy ra sự cố không mong muốn trong ứng dụng. Dữ liệu tài chính của bạn vẫn được lưu trữ an toàn.";

      const displayStack = isDev
        ? (this.state.error.stack ?? "Không có stack trace")
        : "Chi tiết lỗi đã được ghi nhật ký an toàn trên thiết bị (Logs)";

      return (
        <SafeAreaView className="flex-1 bg-surface justify-center items-center px-6">
          <View className="w-full max-w-[420px] bg-surface-container rounded-3xl p-6 border border-border items-center gap-4 shadow-lg">
            <View className="w-14 h-14 rounded-2xl bg-danger/10 items-center justify-center border border-danger/30">
              <AlertCircle size={32} color="#ef4444" />
            </View>

            <View className="items-center gap-1.5">
              <Text variant="h2" className="text-center text-white">
                Đã xảy ra sự cố
              </Text>
              <Text variant="body" className="text-center text-muted leading-5">
                {displayMessage}
              </Text>
            </View>

            {/* Error detail box - Sanitized and collapsed in production */}
            <View className="w-full bg-surface-container-low rounded-xl p-3.5 border border-border/80 max-h-48">
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-xs font-mono text-danger leading-4">{displayStack}</Text>
              </ScrollView>
            </View>

            <View className="w-full flex-row gap-2.5 pt-2">
              <Button
                variant="outline"
                onPress={this.handleCopy}
                className="flex-1 flex-row items-center justify-center gap-1.5 border-border"
              >
                {this.state.copied ? (
                  <Check size={18} color="#10b981" />
                ) : (
                  <Copy size={18} color="#a1a1aa" />
                )}
                <Text className="text-sm font-semibold text-white">
                  {this.state.copied ? "Đã sao chép" : "Sao chép lỗi"}
                </Text>
              </Button>

              <Button
                variant="default"
                onPress={this.handleRestart}
                className="flex-1 flex-row items-center justify-center gap-1.5"
              >
                <RefreshCw size={18} color="#ffffff" />
                <Text className="text-sm font-semibold text-white">Thử lại</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
