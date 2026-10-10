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
import {
  ArrowRight,
  Compass,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react-native";
import { Button, Toast, type ToastVariant } from "@/components/ui";
import { GoogleLogo, OpenSpendEmblem } from "@/components/icons";
function calculateStrength(pwd: string) {
  if (!pwd) return { score: 0, label: "" };
  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 8) score += 1;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  const labels: Record<number, string> = {
    1: "Yếu",
    2: "Trung bình",
    3: "Khá",
    4: "Mạnh",
  };

  return { score, label: labels[score] || "Yếu" };
}
interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null);

  const triggerToast = (message: string, variant: ToastVariant = "success") => {
    setToast({ message, variant });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const clearError = (field: keyof RegisterErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const { score: strengthScore, label: strengthLabel } = calculateStrength(password);

  const handleRegister = () => {
    const newErrors: RegisterErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!trimmedEmail) {
      newErrors.email = "Vui lòng nhập địa chỉ email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Địa chỉ email không đúng định dạng";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có tối thiểu 8 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận lại mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!agreeTerms) {
      newErrors.terms = "Vui lòng đồng ý với điều khoản dịch vụ để tiếp tục";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      triggerToast("Đăng ký tài khoản thành công!", "success");
      setTimeout(() => {
        router.replace("/");
      }, 1200);
    }, 900);
  };

  const handleGoogleAuth = () => {
    triggerToast("Đang kết nối tài khoản Google...", "info");
  };

  const handleGuestMode = () => {
    triggerToast("Đang kích hoạt Chế độ Khách...", "info");
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
            {/* Top Brand Header */}
            <View className="items-center mb-7">
              <View className="flex-row items-center gap-2.5 mb-3">
                <View className="w-10 h-10 rounded-xl bg-surface-container-high items-center justify-center border border-border shadow-sm">
                  <OpenSpendEmblem size={26} />
                </View>
                <Text className="text-2xl font-bold text-primary tracking-tight">
                  OpenSpend
                </Text>
              </View>

              <Text className="text-3xl font-extrabold text-primary tracking-tight text-center mb-2">
                Tạo tài khoản mới
              </Text>
              <Text className="text-base text-on-surface-variant text-center max-w-[320px] leading-6">
                Bắt đầu làm chủ tài chính cá nhân chỉ trong vài bước.
              </Text>
            </View>

            {/* Registration Form Card */}
            <View className="w-full bg-surface-container rounded-2xl p-5 border border-border gap-5 shadow-sm">
              {/* Field 1: Họ và tên */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-on-surface">
                  Họ và tên
                </Text>
                <View
                  className={`flex-row items-center bg-surface-container-low rounded-xl border h-12 px-3.5 ${errors.fullName
                    ? "border-danger"
                    : "border-border focus:border-border-interactive"
                    }`}
                >
                  <View className="mr-3">
                    <User size={20} color={errors.fullName ? "#ef4444" : "#A1A1AA"} />
                  </View>
                  <TextInput
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      clearError("fullName");
                    }}
                    placeholder="Nguyễn Văn A"
                    placeholderTextColor="#71717A"
                    className="flex-1 text-base text-primary h-full"
                    autoCapitalize="words"
                  />
                </View>
                {errors.fullName ? (
                  <Text className="text-xs text-danger font-medium mt-0.5">
                    {errors.fullName}
                  </Text>
                ) : null}
              </View>

              {/* Field 2: Email */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-on-surface">
                  Email
                </Text>
                <View
                  className={`flex-row items-center bg-surface-container-low rounded-xl border h-12 px-3.5 ${errors.email
                    ? "border-danger"
                    : "border-border focus:border-border-interactive"
                    }`}
                >
                  <View className="mr-3">
                    <Mail size={20} color={errors.email ? "#ef4444" : "#A1A1AA"} />
                  </View>
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      clearError("email");
                    }}
                    placeholder="name@openspend.vn"
                    placeholderTextColor="#71717A"
                    className="flex-1 text-base text-primary h-full"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                {errors.email ? (
                  <Text className="text-xs text-danger font-medium mt-0.5">
                    {errors.email}
                  </Text>
                ) : null}
              </View>

              {/* Field 3: Mật khẩu */}
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
                    placeholder="Tối thiểu 8 ký tự"
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
                {/* Password Strength Indicator */}
                <View className="mt-2.5 mb-1 gap-2">
                  <View className="flex-row items-center gap-1.5">
                    {[1, 2, 3, 4].map((index) => {
                      const isActive = strengthScore >= index;
                      return (
                        <View
                          key={index}
                          className={`flex-1 h-1.5 rounded-full ${isActive
                            ? strengthScore <= 2
                              ? "bg-amber-400"
                              : "bg-primary"
                            : "bg-surface-container-high"
                            }`}
                        />
                      );
                    })}
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-on-surface-variant">
                      Tối thiểu 8 ký tự, bao gồm số và chữ hoa
                    </Text>
                    {strengthLabel ? (
                      <Text className="text-xs font-semibold text-on-surface">
                        {strengthLabel}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* Field 4: Xác nhận mật khẩu */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-on-surface">
                  Xác nhận mật khẩu
                </Text>
                <View
                  className={`flex-row items-center bg-surface-container-low rounded-xl border h-12 px-3.5 ${errors.confirmPassword
                    ? "border-danger"
                    : "border-border focus:border-border-interactive"
                    }`}
                >
                  <View className="mr-3">
                    <Lock size={20} color={errors.confirmPassword ? "#ef4444" : "#A1A1AA"} />
                  </View>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      clearError("confirmPassword");
                    }}
                    placeholder="Nhập lại mật khẩu vừa đặt"
                    placeholderTextColor="#71717A"
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 text-base text-primary h-full tracking-wider"
                    autoCapitalize="none"
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    className="p-1.5"
                    hitSlop={8}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#A1A1AA" />
                    ) : (
                      <Eye size={20} color="#A1A1AA" />
                    )}
                  </Pressable>
                </View>
                {errors.confirmPassword ? (
                  <Text className="text-xs text-danger font-medium mt-0.5">
                    {errors.confirmPassword}
                  </Text>
                ) : null}
              </View>

              <View className="gap-1.5">
                <Pressable
                  onPress={() => {
                    setAgreeTerms((prev) => !prev);
                    clearError("terms");
                  }}
                  className="flex-row items-start gap-3 py-1.5"
                >
                  <View
                    className={`w-5 h-5 rounded-md border items-center justify-center mt-0.5 ${agreeTerms
                      ? "bg-primary border-primary"
                      : errors.terms
                        ? "bg-surface-container-low border-danger"
                        : "bg-surface-container-low border-border-subtle"
                      }`}
                  >
                    {agreeTerms && (
                      <Text className="text-primary-foreground text-xs font-black leading-none">
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text className="flex-1 text-xs text-on-surface-variant leading-relaxed">
                    Tôi đồng ý với{" "}
                    <Text className="font-semibold text-primary underline">
                      Điều khoản dịch vụ
                    </Text>{" "}
                    và{" "}
                    <Text className="font-semibold text-primary underline">
                      Chính sách bảo mật
                    </Text>{" "}
                    của OpenSpend.
                  </Text>
                </Pressable>
                {errors.terms ? (
                  <Text className="text-xs text-danger font-medium ml-8">
                    {errors.terms}
                  </Text>
                ) : null}
              </View>
              <Button
                onPress={handleRegister}
                loading={loading}
                className="w-full mt-1"
              >
                <Text className="text-base font-bold text-primary-foreground">
                  Đăng ký tài khoản
                </Text>
                <ArrowRight size={19} color="#09090B" />
              </Button>
            </View>

            {/* Splitter Line */}
            <View className="w-full flex-row items-center gap-4 my-6">
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

            {/* Footer Navigation Prompts */}
            <View className="items-center py-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-on-surface-variant">
                  Đã có tài khoản?
                </Text>
                <Pressable onPress={() => router.replace("/")}>
                  <Text className="text-sm font-bold text-primary underline">
                    Đăng nhập ngay
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Toast Notification */}
      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </SafeAreaView>
  );
}
