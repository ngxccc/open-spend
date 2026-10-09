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
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
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
          contentContainerClassName="px-4 pt-6 pb-12 items-center"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header */}
          <View className="items-center mb-6">
            {/* Geometric Vault Shield */}
            <View className="relative mb-4">
              <View className="w-16 h-16 rounded-xl bg-surface-container-high items-center justify-center border border-border">
                <View className="w-11 h-11 rounded-lg bg-surface-container items-center justify-center">
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Rect
                      x={3}
                      y={5}
                      width={18}
                      height={14}
                      rx={2}
                      stroke="#FFFFFF"
                      strokeWidth={1.8}
                      fill="none"
                    />
                    <Line
                      x1={7}
                      y1={15}
                      x2={7}
                      y2={9}
                      stroke="#FFFFFF"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                    <Line
                      x1={11}
                      y1={15}
                      x2={11}
                      y2={12}
                      stroke="#FFFFFF"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                    <Line
                      x1={15}
                      y1={15}
                      x2={15}
                      y2={10}
                      stroke="#FFFFFF"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                    <Circle cx={18} cy={12} r={1} fill="#FFFFFF" />
                  </Svg>
                </View>
              </View>
              {/* Tactical Status Beacon Dot */}
              <View className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-surface-container items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-primary" />
              </View>
            </View>

            {/* Typography */}
            <Text className="text-[11px] font-bold tracking-[2px] text-on-surface-variant mb-1 uppercase">
              OPENSPEND
            </Text>
            <Text className="text-2xl font-bold text-primary tracking-tight mb-1.5 text-center">
              Chào mừng trở lại
            </Text>
            <Text className="text-[13px] text-on-surface-variant text-center max-w-[280px] leading-5">
              Quản lý dòng tiền và tài sản cá nhân với độ chính xác cao.
            </Text>
          </View>

          {/* Main Login Card Panel */}
          <View className="w-full bg-surface-container rounded-xl p-4 border border-border gap-4 shadow-sm">
            {/* Input: Identifier */}
            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-on-surface">
                Email hoặc Số điện thoại
              </Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg border border-border h-11 px-3">
                <View className="mr-2.5">
                  <Mail size={18} color="#C4C7C9" />
                </View>
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="name@openfinance.vn"
                  placeholderTextColor="#444749"
                  className="flex-1 text-sm text-primary h-full"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Input: Password */}
            <View className="gap-1.5">
              <Text className="text-xs font-semibold text-on-surface">Mật khẩu tài khoản</Text>
              <View className="flex-row items-center bg-surface-container-low rounded-lg border border-border h-11 px-3">
                <View className="mr-2.5">
                  <Lock size={18} color="#C4C7C9" />
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor="#444749"
                  secureTextEntry={!showPassword}
                  className="flex-1 text-sm text-primary h-full tracking-wider"
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="p-1"
                  hitSlop={8}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#C4C7C9" />
                  ) : (
                    <Eye size={18} color="#C4C7C9" />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row items-center justify-between py-0.5">
              <Pressable
                onPress={() => setRememberMe((prev) => !prev)}
                className="flex-row items-center gap-2"
              >
                <View
                  className={`w-4 h-4 rounded border items-center justify-center ${
                    rememberMe
                      ? 'bg-primary border-primary'
                      : 'bg-surface-container-low border-border-interactive'
                  }`}
                >
                  {rememberMe && (
                    <Text className="text-on-primary text-[10px] font-extrabold leading-3">✓</Text>
                  )}
                </View>
                <Text className="text-xs text-on-surface-variant">Ghi nhớ phiên</Text>
              </Pressable>

              <Pressable onPress={() => triggerToast('Tính năng khôi phục đang chuẩn bị')}>
                <Text className="text-xs text-primary font-medium">Quên mật khẩu?</Text>
              </Pressable>
            </View>

            {/* Primary Submit Button */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary flex-row items-center justify-center gap-2 mt-1 active:opacity-90"
            >
              {loading ? (
                <ActivityIndicator color="#121214" size="small" />
              ) : (
                <>
                  <Text className="text-sm font-bold text-on-primary">Đăng nhập</Text>
                  <ArrowRight size={17} color="#121214" />
                </>
              )}
            </Pressable>
          </View>

          {/* Splitter Line */}
          <View className="w-full flex-row items-center gap-3 my-6">
            <View className="flex-1 h-px bg-surface-container-high" />
            <Text className="text-[10px] font-bold tracking-[2px] text-on-surface-variant">
              HOẶC
            </Text>
            <View className="flex-1 h-px bg-surface-container-high" />
          </View>

          {/* Guest Mode / Offline Sandbox Card */}
          <View className="w-full bg-surface-container-low rounded-xl p-3.5 border border-border mb-4">
            <View className="flex-row items-start gap-3">
              <View className="w-9 h-9 rounded-lg bg-surface-container-high items-center justify-center border border-border">
                <Compass size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-semibold text-primary">Chế độ Khách</Text>
                  <View className="bg-surface-container-highest px-1.5 py-0.5 rounded">
                    <Text className="text-[10px] font-semibold text-primary">Offline</Text>
                  </View>
                </View>
                <Text className="text-xs text-on-surface-variant mt-1 leading-snug">
                  Trải nghiệm đầy đủ tính năng. Toàn bộ cơ sở dữ liệu được mã hóa và lưu trực tiếp
                  trong thiết bị của bạn.
                </Text>
              </View>
            </View>

            <View className="mt-3 pt-2.5 border-t border-surface-container-high flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Lock size={14} color="#C4C7C9" />
                <Text className="text-[11px] text-on-surface-variant">Không cần số điện thoại</Text>
              </View>
              <Pressable
                onPress={handleGuestMode}
                className="h-7 px-2.5 rounded bg-surface-container-highest flex-row items-center gap-1 active:opacity-80"
              >
                <Text className="text-[11px] font-semibold text-primary">Khám phá ngay</Text>
                <ChevronRight size={13} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Google Social Login */}
          <Pressable
            onPress={handleGoogleAuth}
            className="w-full h-11 bg-surface-container rounded-lg border border-border flex-row items-center justify-center gap-2.5 mb-6 active:opacity-90"
          >
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <Path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <Path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <Path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </Svg>
            <Text className="text-xs font-semibold text-primary">Tiếp tục với Google</Text>
          </Pressable>

          {/* Footer Prompt & Security Badge */}
          <View className="items-center gap-3">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs text-on-surface-variant">Chưa có tài khoản?</Text>
              <Pressable onPress={() => triggerToast('Mở màn hình Đăng ký mới')}>
                <Text className="text-xs font-semibold text-primary">Tạo tài khoản mới</Text>
              </Pressable>
            </View>

            <View className="flex-row items-center gap-1.5 px-3 py-1 bg-surface-container-lowest rounded-full border border-border">
              <ShieldCheck size={13} color="#8E9193" />
              <Text className="text-[11px] text-outline">Mã hóa chuẩn ngân hàng (AES-256)</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <View className="absolute bottom-6 self-center bg-surface-container-highest px-4 py-2.5 rounded-lg flex-row items-center gap-2.5 border border-border-interactive shadow-lg">
          <CheckCircle size={17} color="#34D399" />
          <Text className="text-xs font-semibold text-primary">{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
