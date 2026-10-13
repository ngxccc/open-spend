import { Tabs, router } from "expo-router";
import { View, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LayoutDashboard, ReceiptText, Plus, Wallet, User } from "lucide-react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  // Web does not need mobile gesture inset; mobile uses insets.bottom
  const bottomInset = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 10);
  const tabHeight = 60 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#121214",
          borderTopColor: "#27272a",
          borderTopWidth: 1,
          height: tabHeight,
          paddingTop: 8,
          paddingBottom: bottomInset,
          overflow: "visible",
        },
        tabBarItemStyle: {
          height: 48,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#a1a1aa",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tổng quan",
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="ledger"
        options={{
          title: "Giao dịch",
          tabBarIcon: ({ color, size }) => <ReceiptText color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="create-action"
        options={{
          title: "Thêm",
          tabBarButton: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ghi chép giao dịch mới"
              className="items-center justify-center -top-4"
              onPress={() => router.push("/create-transaction")}
            >
              <View className="w-13 h-13 rounded-full bg-white items-center justify-center shadow-lg shadow-black/60 border border-white/20">
                <Plus color="#121214" size={28} strokeWidth={2.8} />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="wallets"
        options={{
          title: "Ví",
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Cá nhân",
          tabBarIcon: ({ color, size }) => <User color={color} size={size ?? 22} />,
        }}
      />
    </Tabs>
  );
}
