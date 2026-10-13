import "@/global.css";
import { Stack, DarkTheme, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@rn-primitives/portal";
import { ErrorBoundary } from "@/components/ui";

const OPENS_SPEND_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#ffffff",
    background: "#121214",
    card: "#121214",
    text: "#f4f4f5",
    border: "#27272a",
    notification: "#f59e0b",
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#121214" }}>
      <ThemeProvider value={OPENS_SPEND_THEME}>
        <ErrorBoundary>
          <StatusBar style="light" />
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerShown: false,
              animation: "none",
              contentStyle: { backgroundColor: "#121214" },
            }}
          />
          <PortalHost />
        </ErrorBoundary>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
