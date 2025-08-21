import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#fff" }}>
      <Stack.Screen name="index" options={{ title: "Pedidos" }} />
      <Stack.Screen name="auth" options={{ title: "Entrar" }} />
      <Stack.Screen name="active" options={{ title: "Em rota" }} />
      <Stack.Screen name="history" options={{ title: "Histórico" }} />
      <Stack.Screen name="profile" options={{ title: "Perfil" }} />
    </Stack>
  );
}