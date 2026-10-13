import { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Text, Card, Badge } from "@/components/ui";
import { OpenSpendEmblem } from "@/components/icons";
import {
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Utensils,
  ShoppingBag,
  Receipt,
  Car,
  Landmark,
  Coffee,
  Coins,
  Store,
  FileText,
  AlertTriangle,
  HeartPulse,
  GraduationCap,
  Sparkles,
} from "lucide-react-native";
import { kvStorage, StorageKeys } from "@/lib/storage";

type TimePeriod = "week" | "month" | "year";

interface CategoryAllocation {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  icon: typeof Utensils;
}

const CATEGORIES_DATA: CategoryAllocation[] = [
  { id: "1", name: "Ăn uống", amount: 7700000, percentage: 42, icon: Utensils },
  { id: "2", name: "Mua sắm", amount: 4400000, percentage: 24, icon: ShoppingBag },
  { id: "3", name: "Hóa đơn & Tiện ích", amount: 3670000, percentage: 20, icon: Receipt },
  { id: "4", name: "Di chuyển xe cộ", amount: 2580000, percentage: 14, icon: Car },
  { id: "5", name: "Y tế & Sức khỏe", amount: 1500000, percentage: 8, icon: HeartPulse },
  { id: "6", name: "Giáo dục & Khóa học", amount: 1200000, percentage: 6, icon: GraduationCap },
  { id: "7", name: "Khác", amount: 800000, percentage: 4, icon: Sparkles },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<TimePeriod>("month");
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const [isPrivacyMasked, setIsPrivacyMasked] = useState<boolean>(() => {
    return kvStorage.getBoolean(StorageKeys.PRIVACY_MASK) ?? false;
  });

  const [greetingText] = useState(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  });

  const [currentDateSubtitle] = useState(() => {
    const now = new Date();
    return `Tháng ${now.getMonth() + 1}, ${now.getFullYear()} • Chế độ ngoại tuyến`;
  });

  const togglePrivacy = () => {
    setIsPrivacyMasked((prev) => {
      const next = !prev;
      kvStorage.set(StorageKeys.PRIVACY_MASK, next);
      return next;
    });
  };

  /**
   * Only the net worth balance is affected by privacy masking.
   * Other monetary numbers remain visible.
   */
  const formatBalance = (amount: number) => {
    if (isPrivacyMasked) return "****** đ";
    return `${new Intl.NumberFormat("vi-VN").format(amount)} đ`;
  };

  const formatMoney = (amount: number, prefix: string = "") => {
    const formatted = new Intl.NumberFormat("vi-VN").format(amount);
    return `${prefix}${formatted} đ`;
  };

  // Realistic numbers strictly matching mockup
  const netWorth = 148520000;
  const incomeThisMonth = 42500000;
  const expenseThisMonth = 18350000;

  const visibleCategories = showAllCategories ? CATEGORIES_DATA : CATEGORIES_DATA.slice(0, 4);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom + 96, 120),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2.5">
            <OpenSpendEmblem size={28} />
            <Text variant="h2">OpenSpend</Text>
          </View>

          {/* Guest Sync Prompt Badge */}
          <Pressable onPress={() => router.push("/register")}>
            <Badge variant="warning">
              <AlertTriangle color="#f59e0b" size={14} />
              <Text variant="captionMedium" className="text-amber-500">
                Chưa sao lưu
              </Text>
            </Badge>
          </Pressable>
        </View>

        {/* User Greeting Section */}
        <View className="mb-5">
          <Text variant="h1">{greetingText}, Khách 👋</Text>
          <Text variant="body" className="text-on-surface-variant mt-1">
            {currentDateSubtitle}
          </Text>
        </View>

        {/* Time Period Filter Tabs */}
        <View className="flex-row bg-surface-container-low p-1.5 rounded-2xl mb-5 border border-border">
          {(["week", "month", "year"] as const).map((p) => {
            const label = p === "week" ? "Tuần này" : p === "month" ? "Tháng này" : "Năm nay";
            const isActive = period === p;
            return (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                className={`flex-1 py-2.5 rounded-xl items-center ${isActive ? "bg-primary" : ""}`}
              >
                <Text
                  variant="bodyMedium"
                  className={
                    isActive ? "text-primary-foreground font-semibold" : "text-on-surface-variant"
                  }
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Card 1: Tổng số dư khả dụng */}
        <Card className="mb-4.5">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <Wallet color="#a1a1aa" size={18} />
              <Text variant="bodyMedium" className="text-on-surface-variant">
                Tổng số dư khả dụng
              </Text>
            </View>
            <Pressable hitSlop={12} onPress={togglePrivacy} accessibilityLabel="Ẩn hoặc hiện số dư">
              {isPrivacyMasked ? (
                <EyeOff color="#a1a1aa" size={22} />
              ) : (
                <Eye color="#a1a1aa" size={22} />
              )}
            </Pressable>
          </View>

          {/* Masked Balance */}
          <Text variant="display" className="mb-2">
            {formatBalance(netWorth)}
          </Text>

          {/* Growth Tag */}
          <View className="flex-row items-center gap-1 mb-4.5">
            <Badge variant="default">
              <Text variant="subtextMedium" className="text-on-surface-secondary">
                ↗ +8.4% so với tháng trước
              </Text>
            </Badge>
          </View>

          {/* Thu nhập & Tổng chi tiêu */}
          <View className="flex-row gap-3.5 mb-5">
            <View className="flex-1 bg-surface-container p-4 rounded-xl border border-border">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-6 h-6 rounded-full bg-emerald-500/20 items-center justify-center">
                  <ArrowDownLeft color="#10b981" size={15} strokeWidth={2.5} />
                </View>
                <Text variant="bodyMedium" className="text-on-surface-variant">
                  Thu nhập
                </Text>
              </View>
              <Text variant="h3" className="text-emerald-400">
                {formatMoney(incomeThisMonth, "+")}
              </Text>
            </View>

            <View className="flex-1 bg-surface-container p-4 rounded-xl border border-border">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-6 h-6 rounded-full bg-rose-500/20 items-center justify-center">
                  <ArrowUpRight color="#ef4444" size={15} strokeWidth={2.5} />
                </View>
                <Text variant="bodyMedium" className="text-on-surface-variant">
                  Tổng chi tiêu
                </Text>
              </View>
              <Text variant="h3" className="text-rose-400">
                {formatMoney(expenseThisMonth, "-")}
              </Text>
            </View>
          </View>

          {/* 4 Nút Hành động nhanh */}
          <View className="flex-row justify-around pt-2">
            <Pressable onPress={() => router.push("/create-transaction")} className="items-center">
              <View className="w-13 h-13 rounded-full bg-surface-container-high items-center justify-center mb-1.5 border border-border-subtle">
                <PlusCircle color="#ffffff" size={22} />
              </View>
              <Text variant="captionMedium">Thêm GD</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(tabs)/wallets")} className="items-center">
              <View className="w-13 h-13 rounded-full bg-surface-container-high items-center justify-center mb-1.5 border border-border-subtle">
                <ArrowLeftRight color="#ffffff" size={21} />
              </View>
              <Text variant="captionMedium">Chuyển tiền</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(tabs)/wallets")} className="items-center">
              <View className="w-13 h-13 rounded-full bg-surface-container-high items-center justify-center mb-1.5 border border-border-subtle">
                <Wallet color="#ffffff" size={21} />
              </View>
              <Text variant="captionMedium">Ví của tôi</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(tabs)/ledger")} className="items-center">
              <View className="w-13 h-13 rounded-full bg-surface-container-high items-center justify-center mb-1.5 border border-border-subtle">
                <BarChart3 color="#ffffff" size={21} />
              </View>
              <Text variant="captionMedium">Báo cáo</Text>
            </Pressable>
          </View>
        </Card>

        {/* Card 2: Hạn mức chi tiêu tháng (Empty CTA Card) */}
        <Card className="mb-4.5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2.5">
              <View className="w-9 h-9 rounded-xl bg-surface-container-high items-center justify-center">
                <Landmark color="#f4f4f5" size={18} />
              </View>
              <View>
                <Text variant="h3">Hạn mức chi tiêu tháng</Text>
                <Text variant="subtext">Quản lý ngân sách</Text>
              </View>
            </View>
            <Pressable className="flex-row items-center gap-1">
              <Text variant="subtextMedium" className="text-on-surface-variant">
                Thiết lập
              </Text>
              <ChevronRight color="#a1a1aa" size={16} />
            </Pressable>
          </View>
          <Text variant="body" className="text-on-surface-variant">
            Chưa thiết lập ngân sách tháng này. Đặt hạn mức chi tiêu để kiểm soát tài chính thông
            minh hơn.
          </Text>
        </Card>

        {/* Card 3: Phân bổ chi tiêu */}
        <Card className="mb-4.5">
          <View className="flex-row items-center justify-between mb-3.5">
            <Text variant="h3">Phân bổ chi tiêu</Text>
            <Pressable
              onPress={() => setShowAllCategories((prev) => !prev)}
              className="flex-row items-center gap-1"
            >
              <Text variant="subtextMedium">{CATEGORIES_DATA.length} Danh mục</Text>
              {showAllCategories ? (
                <ChevronUp color="#a1a1aa" size={15} />
              ) : (
                <ChevronDown color="#a1a1aa" size={15} />
              )}
            </Pressable>
          </View>

          {/* Segmented Monochrome Bar */}
          <View className="flex-row h-2 rounded-full overflow-hidden bg-surface-container-high mb-4 gap-1">
            <View style={{ width: "42%" }} className="bg-primary rounded-full" />
            <View style={{ width: "24%" }} className="bg-[#71717a] rounded-full" />
            <View style={{ width: "20%" }} className="bg-[#52525b] rounded-full" />
            <View style={{ width: "14%" }} className="bg-[#3f3f46] rounded-full" />
          </View>

          {/* Dynamic Category Tiles - Đảm bảo Tiêu đề tự xuống dòng (drop title), % cố định góc trên bên phải */}
          <View className="flex-row flex-wrap gap-2.5">
            {visibleCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <View
                  key={cat.id}
                  className="w-[48%] bg-surface-container p-3.5 rounded-xl border border-border justify-between min-h-[96px]"
                >
                  {/* Hàng trên: Icon + Tên danh mục (bên trái) vs Phần trăm (bên phải cố định) */}
                  <View className="flex-row items-start justify-between gap-1 mb-2">
                    <View className="flex-row items-start gap-1.5 flex-1 pr-1">
                      <View className="mt-0.5 shrink-0">
                        <IconComp color="#a1a1aa" size={16} />
                      </View>
                      <Text
                        variant="bodyMedium"
                        className="flex-1 text-[14px] leading-5 text-on-surface"
                      >
                        {cat.name}
                      </Text>
                    </View>
                    <Text
                      variant="captionMedium"
                      className="shrink-0 text-on-surface-variant font-semibold mt-0.5"
                    >
                      {cat.percentage}%
                    </Text>
                  </View>

                  {/* Hàng dưới: Số tiền luôn nằm gọn đáy ô */}
                  <Text variant="bodySemi" className="tracking-tight">
                    {formatMoney(cat.amount)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Nút Thu gọn / Xem tất cả danh mục */}
          {CATEGORIES_DATA.length > 4 && (
            <Pressable
              onPress={() => setShowAllCategories((prev) => !prev)}
              className="mt-3 pt-2.5 border-t border-border/60 flex-row items-center justify-center gap-1"
            >
              <Text variant="captionMedium" className="text-on-surface-variant">
                {showAllCategories
                  ? "Thu gọn danh mục"
                  : `Xem thêm ${CATEGORIES_DATA.length - 4} danh mục khác`}
              </Text>
              {showAllCategories ? (
                <ChevronUp color="#a1a1aa" size={14} />
              ) : (
                <ChevronDown color="#a1a1aa" size={14} />
              )}
            </Pressable>
          )}
        </Card>

        {/* Section 4: Giao dịch gần đây */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3.5">
            <Text variant="h3">Giao dịch gần đây</Text>
            <Pressable
              onPress={() => router.push("/(tabs)/ledger")}
              className="flex-row items-center gap-1"
            >
              <Text variant="subtextMedium">Xem tất cả</Text>
              <ChevronRight color="#a1a1aa" size={16} />
            </Pressable>
          </View>

          <View className="gap-3">
            <Card className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3.5">
                <View className="w-11 h-11 rounded-xl bg-surface-container-high items-center justify-center">
                  <Coffee color="#f4f4f5" size={20} />
                </View>
                <View>
                  <Text variant="bodySemi">Phê La Coffee</Text>
                  <Text variant="subtext" className="mt-0.5">
                    Ăn uống • Hôm nay, 09:30
                  </Text>
                </View>
              </View>
              <Text variant="bodySemi" className="text-rose-400">
                {formatMoney(65000, "-")}
              </Text>
            </Card>

            <Card className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3.5">
                <View className="w-11 h-11 rounded-xl bg-surface-container-high items-center justify-center">
                  <Coins color="#f4f4f5" size={20} />
                </View>
                <View>
                  <Text variant="bodySemi">Lương TechCorp</Text>
                  <Text variant="subtext" className="mt-0.5">
                    Thu nhập • Hôm qua, 17:00
                  </Text>
                </View>
              </View>
              <Text variant="bodySemi" className="text-emerald-400">
                {formatMoney(42500000, "+")}
              </Text>
            </Card>

            <Card className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3.5">
                <View className="w-11 h-11 rounded-xl bg-surface-container-high items-center justify-center">
                  <Store color="#f4f4f5" size={20} />
                </View>
                <View>
                  <Text variant="bodySemi">Siêu thị WinMart</Text>
                  <Text variant="subtext" className="mt-0.5">
                    Mua sắm • 24 Th10
                  </Text>
                </View>
              </View>
              <Text variant="bodySemi" className="text-rose-400">
                {formatMoney(842000, "-")}
              </Text>
            </Card>

            <Card className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3.5">
                <View className="w-11 h-11 rounded-xl bg-surface-container-high items-center justify-center">
                  <FileText color="#f4f4f5" size={20} />
                </View>
                <View>
                  <Text variant="bodySemi">Điện & Nước EVN</Text>
                  <Text variant="subtext" className="mt-0.5">
                    Hóa đơn • 22 Th10
                  </Text>
                </View>
              </View>
              <Text variant="bodySemi" className="text-rose-400">
                {formatMoney(1250000, "-")}
              </Text>
            </Card>

            <Card className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3.5">
                <View className="w-11 h-11 rounded-xl bg-surface-container-high items-center justify-center">
                  <Car color="#f4f4f5" size={20} />
                </View>
                <View>
                  <Text variant="bodySemi">Grab Car di chuyển</Text>
                  <Text variant="subtext" className="mt-0.5">
                    Di chuyển • 21 Th10
                  </Text>
                </View>
              </View>
              <Text variant="bodySemi" className="text-rose-400">
                {formatMoney(128000, "-")}
              </Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
