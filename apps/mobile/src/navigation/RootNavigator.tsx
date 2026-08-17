import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../theme";
import { useAuth } from "../context/AuthContext";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { MyraChatScreen } from "../screens/MyraChatScreen";
import { NexRideScreen } from "../screens/NexRideScreen";
import { NexFoodScreen } from "../screens/NexFoodScreen";
import { NexMedsScreen } from "../screens/NexMedsScreen";
import { NexHomeScreen } from "../screens/NexHomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICON: Record<string, string> = {
  Home: "🏡",
  MyraChat: "✨",
  Profile: "👤",
};

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICON[route.name]}</Text>,
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
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.textPrimary, headerShadowVisible: false }}>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="NexRide" component={NexRideScreen} options={{ title: "NexRide" }} />
      <Stack.Screen name="NexFood" component={NexFoodScreen} options={{ title: "NexFood" }} />
      <Stack.Screen name="NexMeds" component={NexMedsScreen} options={{ title: "NexMeds" }} />
      <Stack.Screen name="NexHome" component={NexHomeScreen} options={{ title: "NexHome" }} />
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
