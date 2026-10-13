import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui";

export default function LedgerScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface px-4 pt-4">
      <Text className="text-xl font-bold text-white mb-2">Sổ giao dịch</Text>
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted text-sm text-center">
          Chưa có giao dịch nào được ghi nhận.{"\n"}Chức năng Ledger feed (FlashList) đang được
          chuẩn bị.
        </Text>
      </View>
    </SafeAreaView>
  );
}
