import React, { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { ChatMessage } from "@nexserv/shared";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatBubble } from "../components/ChatBubble";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

export function MyraChatScreen() {
  const { colors, spacing, radius, type } = useTheme();
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <Text style={[type.title, { color: colors.textPrimary }]}>Myra</Text>
          <Text style={[type.caption, { color: colors.textMuted }]}>Ask anything, or just tell her what's going on.</Text>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.md }}
          renderItem={({ item }) => <ChatBubble message={item} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Message Myra..."
            placeholderTextColor={colors.textMuted}
            style={{ flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 12, color: colors.textPrimary }}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <Pressable onPress={() => send(input)} disabled={sending} style={{ backgroundColor: brand.myraStart, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 12, opacity: sending ? 0.6 : 1 }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
