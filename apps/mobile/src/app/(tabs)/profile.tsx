import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { kvStorage, StorageKeys } from "@/lib/storage";

export default function ProfileScreen() {
  const isGuest = kvStorage.getBoolean(StorageKeys.GUEST_SESSION) ?? true;

  const handleLogoutOrExitGuest = () => {
    kvStorage.remove(StorageKeys.GUEST_SESSION);
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface px-4 pt-4">
      <Text className="text-xl font-bold text-white mb-2">Cá nhân & Cài đặt</Text>
      <View className="flex-1 justify-between py-6">
        <View className="bg-surfaceLow p-4 rounded-xl border border-border">
          <Text className="text-white font-medium text-base mb-1">
            {isGuest ? "Chế độ Khách (Offline)" : "Tài khoản OpenSpend"}
          </Text>
          <Text className="text-muted text-xs">
            {isGuest
              ? "Dữ liệu đang được lưu cục bộ trên thiết bị của bạn."
              : "Dữ liệu được bảo mật và đồng bộ đám mây."}
          </Text>
        </View>

        <Button
          variant="outline"
          onPress={handleLogoutOrExitGuest}
          className="border-border text-white"
        >
          <Text className="text-white font-medium">
            {isGuest ? "Thoát Chế độ Khách" : "Đăng xuất"}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
