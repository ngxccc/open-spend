import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui";

export default function WalletsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface px-4 pt-4">
      <Text className="text-xl font-bold text-white mb-2">Ví & Tài sản</Text>
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted text-sm text-center">
          Quản lý ví và chuyển tiền giữa các ví (Issue #8 & #11).
        </Text>
      </View>
    </SafeAreaView>
  );
}
