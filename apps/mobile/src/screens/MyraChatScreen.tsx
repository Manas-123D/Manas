import React, { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ChatMessage } from "@nexserv/shared";
import { ChatBubble } from "../components/ChatBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { SuggestionChip } from "../components/SuggestionChip";
import { MyraOrb } from "../components/MyraOrb";
import { AmbientBackground } from "../components/AmbientBackground";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";
import { SafeAreaView } from "react-native-safe-area-context";

const STARTERS = [
  "What's the weather like right now?",
  "Book me a ride to work",
  "What's trending nearby?",
  "Remind me about my last order",
];

export function MyraChatScreen() {
  const { colors, spacing, radius, type, isDark, shadow } = useTheme();
  const route = useRoute<any>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    apiRequest<{ messages: ChatMessage[] }>("/myra/chat")
      .then((res) => setMessages(res.messages))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const seed = route.params?.seedMessage as string | undefined;
    if (seed) send(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.seedMessage]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setSending(true);
    const optimistic: ChatMessage = { id: `local-${Date.now()}`, role: "user", content: trimmed, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await apiRequest<{ reply: string }>("/myra/chat", { method: "POST", body: { message: trimmed } });
      setMessages((prev) => [...prev, { id: `local-reply-${Date.now()}`, role: "myra", content: res.reply, createdAt: new Date().toISOString() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `local-error-${Date.now()}`, role: "myra", content: "I couldn't reach the server just now — please try again.", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <AmbientBackground />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
        <View style={[styles.header, { paddingHorizontal: spacing.lg, borderBottomColor: colors.glassBorder }]}>
          <MyraOrb size={38} />
          <View>
            <Text style={[type.title, { color: colors.textPrimary }]}>Myra</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[type.caption, { color: colors.textMuted }]}>Here, watching over things with you</Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md, flexGrow: 1 }}
          renderItem={({ item }) => <ChatBubble message={item} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={sending ? <TypingIndicator /> : null}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MyraOrb size={64} />
              <Text style={[type.subtitle, { color: colors.textPrimary, marginTop: spacing.lg, textAlign: "center" }]}>
                What's on your mind?
              </Text>
              <Text style={[type.caption, { color: colors.textMuted, marginTop: spacing.xs, textAlign: "center" }]}>
                Ask anything, or just tell her what's going on.
              </Text>
              <View style={[styles.starterWrap, { gap: spacing.sm, marginTop: spacing.xl }]}>
                {STARTERS.map((s) => (
                  <SuggestionChip key={s} label={s} onPress={() => send(s)} />
                ))}
              </View>
            </View>
          }
        />

        <View style={[styles.inputBarWrap, { borderTopColor: colors.glassBorder }]}>
          <BlurView intensity={isDark ? 50 : 70} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          <View style={[styles.inputBar, { padding: spacing.lg, gap: spacing.sm }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Message Myra..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.glass,
                  borderColor: colors.glassBorder,
                  borderRadius: radius.pill,
                  color: colors.textPrimary,
                },
              ]}
              onSubmitEditing={() => send(input)}
              returnKeyType="send"
            />
            <View style={[{ borderRadius: radius.pill }, shadow.glow(brand.myraStart, 0.45)]}>
              <Pressable onPress={() => send(input)} disabled={sending}>
                <LinearGradient
                  colors={[brand.myraStart, brand.myraEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.sendBtn, { borderRadius: radius.pill, opacity: sending ? 0.6 : 1 }]}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Send</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 16, borderBottomWidth: 1 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 },
  starterWrap: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  inputBarWrap: { overflow: "hidden", borderTopWidth: 1 },
  inputBar: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 12 },
  sendBtn: { paddingHorizontal: 18, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
});
