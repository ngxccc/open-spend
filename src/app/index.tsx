import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button, Toast } from "@/components/ui";
import { GoogleLogo, OpenSpendEmblem } from "@/components/icons";
import {
  ArrowRight,
  Compass,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react-native";
interface LoginErrors {
  identifier?: string;
  password?: string;
}

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const clearError = (field: keyof LoginErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = () => {
    const newErrors: LoginErrors = {};
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      newErrors.identifier = "Vui lòng nhập địa chỉ email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId)) {
      newErrors.identifier = "Địa chỉ email không đúng định dạng";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      triggerToast("Đăng nhập thành công!");
    }, 800);
  };
  const handleGuestMode = () => {
    triggerToast("Đang kích hoạt Chế độ Khách...");
  };

  const handleGoogleAuth = () => {
    triggerToast("Đang kết nối tài khoản Google...");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-5 py-8 items-center"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[420px] items-center">
            <View className="items-center mb-7">
              {/* Horizontal Brand Lockup */}
              <View className="flex-row items-center gap-2.5 mb-3">
                <View className="w-10 h-10 rounded-xl bg-surface-container-high items-center justify-center border border-border shadow-sm">
                  <OpenSpendEmblem size={26} />
                </View>
                <Text className="text-2xl font-bold text-primary tracking-tight">
                  OpenSpend
                </Text>
              </View>

              {/* Screen Title */}
              <Text className="text-3xl font-extrabold text-primary tracking-tight text-center mb-2">
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
                  Email
                </Text>
                <View
                  className={`flex-row items-center bg-surface-container-low rounded-xl border h-12 px-3.5 ${errors.identifier
                      ? "border-danger"
                      : "border-border focus:border-border-interactive"
                    }`}
                >
                  <View className="mr-3">
                    <Mail size={20} color={errors.identifier ? "#ef4444" : "#A1A1AA"} />
                  </View>
                  <TextInput
                    value={identifier}
                    onChangeText={(text) => {
                      setIdentifier(text);
                      clearError("identifier");
                    }}
                    placeholder="name@openfinance.vn"
                    placeholderTextColor="#71717A"
                    className="flex-1 text-base text-primary h-full"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                {errors.identifier ? (
                  <Text className="text-xs text-danger font-medium mt-0.5">
                    {errors.identifier}
                  </Text>
                ) : null}
              </View>

              {/* Input: Password */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-on-surface">
                  Mật khẩu
                </Text>
                <View
                  className={`flex-row items-center bg-surface-container-low rounded-xl border h-12 px-3.5 ${errors.password
                      ? "border-danger"
                      : "border-border focus:border-border-interactive"
                    }`}
                >
                  <View className="mr-3">
                    <Lock size={20} color={errors.password ? "#ef4444" : "#A1A1AA"} />
                  </View>
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearError("password");
                    }}
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
                {errors.password ? (
                  <Text className="text-xs text-danger font-medium mt-0.5">
                    {errors.password}
                  </Text>
                ) : null}
              </View>

              {/* Remember Me & Forgot Password */}
              <View className="flex-row items-center justify-between py-1">
                <Pressable
                  onPress={() => setRememberMe((prev) => !prev)}
                  className="flex-row items-center gap-2.5"
                >
                  <View
                    className={`w-5 h-5 rounded-md border items-center justify-center ${rememberMe
                      ? "bg-primary border-primary"
                      : "bg-surface-container-low border-border-subtle"
                      }`}
                  >
                    {rememberMe && (
                      <Text className="text-primary-foreground text-xs font-black leading-none">
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm text-on-surface-variant font-medium">
                    Ghi nhớ phiên
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    triggerToast("Tính năng khôi phục đang chuẩn bị")
                  }
                >
                  <Text className="text-sm text-on-surface-secondary font-semibold hover:underline">
                    Quên mật khẩu?
                  </Text>
                </Pressable>
              </View>

              {/* Primary Submit Button */}
              <Button
                onPress={handleLogin}
                loading={loading}
                className="w-full mt-1"
              >
                <Text className="text-base font-bold text-primary-foreground">
                  Đăng nhập
                </Text>
                <ArrowRight size={19} color="#09090B" />
              </Button>
            </View>

            {/* Splitter Line */}
            <View className="w-full flex-row items-center gap-4 my-7">
              <View className="flex-1 h-px bg-surface-container-high" />
              <Text className="text-xs font-bold tracking-[2.5px] text-on-surface-variant">
                HOẶC
              </Text>
              <View className="flex-1 h-px bg-surface-container-high" />
            </View>

            {/* Alternative Auth Actions */}
            <View className="w-full gap-3 mb-6">
              {/* Guest Mode Button */}
              <Button
                variant="secondary"
                onPress={handleGuestMode}
                className="w-full"
              >
                <Compass size={20} color="#FFFFFF" />
                <Text className="text-base font-medium text-primary">
                  Tiếp tục với Chế độ Khách
                </Text>
              </Button>

              {/* Google Social Login Button */}
              <Button
                variant="secondary"
                onPress={handleGoogleAuth}
                className="w-full"
              >
                <GoogleLogo size={20} />
                <Text className="text-base font-medium text-primary">
                  Tiếp tục với Google
                </Text>
              </Button>
            </View>

            {/* Footer Prompt & Security Badge */}
            <View className="items-center gap-3.5">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-on-surface-variant">
                  Chưa có tài khoản?
                </Text>
                <Pressable onPress={() => router.push("/register")}>
                  <Text className="text-sm font-bold text-primary underline">
                    Tạo tài khoản mới
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Toast Notification */}
      {toastMessage && <Toast message={toastMessage} variant="success" />}
    </SafeAreaView>
  );
}
