import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { MyraOrb } from "../components/MyraOrb";
import { useTheme, brand, gradients } from "../theme";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export function OnboardingScreen() {
  const { colors, spacing, radius, type, shadow } = useTheme();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@nexserv.app");
  const [password, setPassword] = useState("password123");
  const [city, setCity] = useState("Hyderabad");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(name, email, password, city);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.glass, borderColor: colors.glassBorder, color: colors.textPrimary, borderRadius: radius.md, marginBottom: spacing.sm },
  ];

  return (
    <Screen scroll={false} style={{ flex: 1, justifyContent: "center" }}>
      <View style={[{ borderRadius: radius.lg, alignSelf: "flex-start" }, shadow.glow(brand.myraMid, 0.5)]}>
        <LinearGradient colors={gradients.myra} style={[styles.mark, { borderRadius: radius.lg }]}>
          <Text style={styles.markText}>N</Text>
        </LinearGradient>
      </View>

      <Text style={[type.hero, { color: colors.textPrimary, marginTop: spacing.lg }]}>NexServ</Text>
      <View style={styles.taglineRow}>
        <MyraOrb size={16} />
        <Text style={[type.body, { color: colors.textSecondary, flex: 1 }]}>
          One companion for mobility, food, medicines and home services — meet Myra.
        </Text>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        {mode === "signup" && (
          <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={colors.textMuted} style={inputStyle} />
        )}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={colors.textMuted}
          style={inputStyle}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor={colors.textMuted}
          style={inputStyle}
        />
        {mode === "signup" && (
          <TextInput value={city} onChangeText={setCity} placeholder="City" placeholderTextColor={colors.textMuted} style={inputStyle} />
        )}
      </View>

      {error && <Text style={[type.caption, { color: colors.danger, marginBottom: spacing.sm }]}>{error}</Text>}

      <View style={{ marginTop: spacing.sm, gap: spacing.sm }}>
        <PrimaryButton label={mode === "login" ? "Log in" : "Create account"} onPress={submit} loading={loading} />
        <PrimaryButton
          variant="outline"
          label={mode === "login" ? "New here? Create an account" : "Have an account? Log in"}
          onPress={() => setMode(mode === "login" ? "signup" : "login")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mark: { width: 56, height: 56, alignItems: "center", justifyContent: "center" },
  markText: { color: "#fff", fontSize: 26, fontWeight: "800" },
  taglineRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10, marginBottom: 14 },
  input: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15 },
});
