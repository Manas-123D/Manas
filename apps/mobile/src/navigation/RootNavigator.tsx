import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, brand } from "../theme";
import { useAuth } from "../context/AuthContext";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { MyraChatScreen } from "../screens/MyraChatScreen";
import { NexRideScreen } from "../screens/NexRideScreen";
import { NexFoodScreen } from "../screens/NexFoodScreen";
import { NexMedsScreen } from "../screens/NexMedsScreen";
import { NexHomeScreen } from "../screens/NexHomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { TrackingScreen } from "../screens/TrackingScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  MyraChat: "sparkles",
  Profile: "person-circle",
};
const TAB_ICON_INACTIVE: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home-outline",
  MyraChat: "sparkles-outline",
  Profile: "person-circle-outline",
};

function MainTabs() {
  const { colors, isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: { backgroundColor: "transparent", borderTopColor: colors.glassBorder, height: 66, paddingTop: 6 },
        tabBarBackground: () => <BlurView intensity={isDark ? 55 : 75} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />,
        tabBarIcon: ({ focused }) => (
          <View
            style={[
              styles.tabIconWrap,
              focused && { backgroundColor: brand.myraStart + (isDark ? "26" : "1a") },
            ]}
          >
            <Ionicons
              name={focused ? TAB_ICON[route.name] : TAB_ICON_INACTIVE[route.name]}
              size={21}
              color={focused ? brand.myraStart : colors.textMuted}
            />
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="MyraChat" component={MyraChatScreen} options={{ title: "Myra" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}

function AppStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="NexRide" component={NexRideScreen} options={{ title: "NexRide" }} />
      <Stack.Screen name="NexFood" component={NexFoodScreen} options={{ title: "NexFood" }} />
      <Stack.Screen name="NexMeds" component={NexMedsScreen} options={{ title: "NexMeds" }} />
      <Stack.Screen name="NexHome" component={NexHomeScreen} options={{ title: "NexHome" }} />
      <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: "Live tracking" }} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { colors, isDark } = useTheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.textPrimary} />
      </View>
    );
  }

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: { ...(isDark ? DarkTheme.colors : DefaultTheme.colors), background: colors.background, card: colors.surface, text: colors.textPrimary, border: colors.border },
  };

  return (
    <NavigationContainer theme={navTheme}>
      {user ? <AppStack /> : <OnboardingScreen />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: { width: 40, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
});
