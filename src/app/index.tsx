import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, LinearGradient, Polygon, Stop } from 'react-native-svg';
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react-native';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLogin = () => {
    if (!identifier.trim() || !password.trim()) {
      triggerToast('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      triggerToast('Đăng nhập thành công!');
    }, 800);
  };

  const handleGuestMode = () => {
    triggerToast('Đang kích hoạt Chế độ Khách (Offline)...');
  };

  const handleGoogleAuth = () => {
    triggerToast('Đang kết nối tài khoản Google...');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-5 pt-8 pb-16 items-center"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header with Official Project Logo Emblem */}
          <View className="items-center mb-8">
            <View className="relative mb-5">
              <View className="w-20 h-20 rounded-2xl bg-surface-container-high items-center justify-center border border-border/80 shadow-md">
                <Svg width={56} height={56} viewBox="0 0 512 512">
                  <Defs>
                    <LinearGradient id="facetWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#FFFFFF" />
                      <Stop offset="100%" stopColor="#E5E1E4" />
                    </LinearGradient>
                    <LinearGradient id="facetSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#C6C6CF" />
                      <Stop offset="100%" stopColor="#8E9193" />
                    </LinearGradient>
                    <LinearGradient id="facetGraphite" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#2F3037" />
                      <Stop offset="100%" stopColor="#1F1F23" />
                    </LinearGradient>
                  </Defs>
                  <G transform="translate(256, 256)">
                    <Polygon points="0,-128 -96,-32 -32,32 0,-32" fill="url(#facetWhite)" />
                    <Polygon points="0,-128 96,-32 32,32 0,-32" fill="url(#facetSilver)" />
                    <Polygon
                      points="-96,-32 0,128 0,64 -32,32"
                      fill="url(#facetGraphite)"
                      stroke="#3F3F46"
                      strokeWidth={2}
                    />
                    <Polygon
                      points="96,-32 0,128 0,64 32,32"
                      fill="url(#facetSilver)"
                      stroke="#27272A"
                      strokeWidth={2}
                    />
                    <Polygon
                      points="0,-32 32,32 0,64 -32,32"
                      fill="#121214"
                      stroke="#3F3F46"
                      strokeWidth={3}
                    />
                    <Circle cx={0} cy={16} r={7} fill="#FFFFFF" />
                  </G>
                </Svg>
              </View>
              {/* Tactical Status Beacon Dot */}
              <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface-container items-center justify-center">
                <View className="w-2.5 h-2.5 rounded-full bg-success" />
              </View>
            </View>

            {/* Typography */}
            <Text className="text-sm font-bold tracking-[3px] text-on-surface-secondary mb-1.5 uppercase">
              OPENSPEND
            </Text>
            <Text className="text-3xl font-extrabold text-primary tracking-tight mb-2 text-center">
              Chào mừng trở lại
            </Text>
            <Text className="text-base text-on-surface-variant text-center max-w-[320px] leading-6">
              Quản lý dòng tiền và tài sản cá nhân với độ chính xác cao.
            </Text>
          </View>

          {/* Main Login Card Panel */}
          <View className="w-full bg-surface-container rounded-2xl p-5 border border-border gap-5 shadow-sm">
            {/* Input: Identifier */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-on-surface">
                Email hoặc Số điện thoại
              </Text>
              <View className="flex-row items-center bg-surface-container-low rounded-xl border border-border h-12 px-3.5 focus:border-border-interactive">
                <View className="mr-3">
                  <Mail size={20} color="#A1A1AA" />
                </View>
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="name@openfinance.vn"
                  placeholderTextColor="#71717A"
                  className="flex-1 text-base text-primary h-full"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Input: Password */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-on-surface">Mật khẩu tài khoản</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-xl border border-border h-12 px-3.5 focus:border-border-interactive">
                <View className="mr-3">
                  <Lock size={20} color="#A1A1AA" />
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor="#71717A"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-base text-primary h-full tracking-wider"
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="p-1.5"
                  hitSlop={8}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#A1A1AA" />
                  ) : (
                    <Eye size={20} color="#A1A1AA" />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row items-center justify-between py-1">
              <Pressable
                onPress={() => setRememberMe((prev) => !prev)}
                className="flex-row items-center gap-2.5"
              >
                <View
                  className={`w-5 h-5 rounded-md border items-center justify-center ${rememberMe
                    ? 'bg-primary border-primary'
                    : 'bg-surface-container-low border-border-subtle'
                    }`}
                >
                  {rememberMe && (
                    <Text className="text-primary-foreground text-xs font-black leading-none">✓</Text>
                  )}
                </View>
                <Text className="text-sm text-on-surface-variant font-medium">Ghi nhớ phiên</Text>
              </Pressable>

              <Pressable onPress={() => triggerToast('Tính năng khôi phục đang chuẩn bị')}>
                <Text className="text-sm text-on-surface-secondary font-semibold hover:underline">
                  Quên mật khẩu?
                </Text>
              </Pressable>
            </View>

            {/* Primary Submit Button */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="w-full h-13 rounded-xl bg-primary flex-row items-center justify-center gap-2.5 mt-1 active:opacity-90 shadow-sm"
            >
              {loading ? (
                <ActivityIndicator color="#09090B" size="small" />
              ) : (
                <>
                  <Text className="text-base font-bold text-primary-foreground">Đăng nhập</Text>
                  <ArrowRight size={19} color="#09090B" />
                </>
              )}
            </Pressable>
          </View>

          {/* Splitter Line */}
          <View className="w-full flex-row items-center gap-4 my-7">
            <View className="flex-1 h-px bg-surface-container-high" />
            <Text className="text-xs font-bold tracking-[2.5px] text-on-surface-variant">
              HOẶC
            </Text>
            <View className="flex-1 h-px bg-surface-container-high" />
          </View>

          {/* Guest Mode / Offline Sandbox Card */}
          <View className="w-full bg-surface-container-low rounded-2xl p-4.5 border border-border mb-5">
            <View className="flex-row items-start gap-3.5">
              <View className="w-10 h-10 rounded-xl bg-surface-container-high items-center justify-center border border-border">
                <Compass size={22} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2.5">
                  <Text className="text-base font-bold text-primary">Chế độ Khách</Text>
                  <View className="bg-surface-container-highest px-2 py-0.5 rounded-md border border-border">
                    <Text className="text-xs font-semibold text-on-surface-secondary">Offline</Text>
                  </View>
                </View>
                <Text className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  Trải nghiệm đầy đủ tính năng. Toàn bộ cơ sở dữ liệu được mã hóa và lưu trực tiếp
                  trong thiết bị của bạn.
                </Text>
              </View>
            </View>

            <View className="mt-4 pt-3 border-t border-surface-container-high flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Lock size={15} color="#A1A1AA" />
                <Text className="text-xs text-on-surface-variant">Không cần số điện thoại</Text>
              </View>
              <Pressable
                onPress={handleGuestMode}
                className="h-8 px-3.5 rounded-lg bg-surface-container-highest flex-row items-center gap-1.5 active:opacity-80 border border-border"
              >
                <Text className="text-xs font-bold text-primary">Khám phá ngay</Text>
                <ChevronRight size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Google Social Login */}
          <Pressable
            onPress={handleGoogleAuth}
            className="w-full h-12 bg-surface-container rounded-xl border border-border flex-row items-center justify-center gap-3 mb-7 active:opacity-90"
          >
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Polygon
                fill="#4285F4"
                points="22.56,12.25 12,12.25 12,16.51 17.92,16.51 16.71,19.82 20.28,22.59 22.56,12.25"
              />
              <Polygon
                fill="#34A853"
                points="12,23 19.28,20.34 16.71,17.57 12,18.82 7.29,17.57 4.72,20.34 12,23"
              />
              <Polygon
                fill="#FBBC05"
                points="5.84,14.09 2.18,7.06 1,12 2.18,16.94 5.84,14.09"
              />
              <Polygon
                fill="#EA4335"
                points="12,5.38 16.21,7.02 19.36,3.87 12,1 4.72,3.87 7.29,7.02 12,5.38"
              />
            </Svg>
            <Text className="text-sm font-bold text-primary">Tiếp tục với Google</Text>
          </Pressable>

          {/* Footer Prompt & Security Badge */}
          <View className="items-center gap-3.5">
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-on-surface-variant">Chưa có tài khoản?</Text>
              <Pressable onPress={() => triggerToast('Mở màn hình Đăng ký mới')}>
                <Text className="text-sm font-bold text-primary underline">
                  Tạo tài khoản mới
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center gap-2 px-3.5 py-1.5 bg-surface-container-lowest rounded-full border border-border">
              <ShieldCheck size={15} color="#A1A1AA" />
              <Text className="text-xs text-on-surface-variant font-medium">
                Mã hóa chuẩn ngân hàng (AES-256)
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <View className="absolute bottom-6 self-center bg-surface-container-highest px-4.5 py-3 rounded-xl flex-row items-center gap-3 border border-border-interactive shadow-lg">
          <CheckCircle size={18} color="#10B981" />
          <Text className="text-sm font-bold text-primary">{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
