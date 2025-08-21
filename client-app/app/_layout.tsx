import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<Stack screenOptions={{ headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#fff" }}>
			<Stack.Screen name="onboarding" options={{ title: "Zorva" }} />
			<Stack.Screen name="auth" options={{ title: "Entrar" }} />
			<Stack.Screen name="index" options={{ title: "Início" }} />
			<Stack.Screen name="cart" options={{ title: "Carrinho" }} />
			<Stack.Screen name="orders" options={{ title: "Pedidos" }} />
			<Stack.Screen name="profile" options={{ title: "Perfil" }} />
		</Stack>
	);
}