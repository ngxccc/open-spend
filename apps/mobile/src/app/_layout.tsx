import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { ErrorBoundary } from "@/components/ui";
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: { backgroundColor: "#131315" },
        }}
      />
      <PortalHost />
    </ErrorBoundary>
  );
}
