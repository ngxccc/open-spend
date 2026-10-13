import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button, Text } from "@/components/ui";

export default function CreateTransactionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface px-4 pt-4 justify-between">
      <View>
        <Text className="text-xl font-bold text-white mb-2">Thêm giao dịch mới</Text>
        <Text className="text-muted text-sm">
          Nhập số tiền và chọn phân loại Thu / Chi (Sẽ tích hợp hoàn chỉnh ở Issue #10).
        </Text>
      </View>

      <Button variant="default" onPress={() => router.back()} className="mb-6">
        <Text className="text-black font-semibold">Quay lại</Text>
      </Button>
    </SafeAreaView>
  );
}
