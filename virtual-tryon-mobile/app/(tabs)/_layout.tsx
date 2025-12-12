import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await AsyncStorage.getItem("auth_session");

      if (!session) {
        // ❌ giriş yok → login ekranına at
        router.replace("/(auth)/login");
        return;
      }

      // ✅ giriş var → tab'ları göster
      setCheckingAuth(false);
    })();
  }, []);

  // 🔒 Auth kontrolü bitene kadar hiçbir şey gösterme
  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
