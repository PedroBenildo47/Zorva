import { Stack } from "expo-router";
import { I18nProvider } from "../i18n";

export default function RootLayout() {
	return (
		<I18nProvider>
			<Stack screenOptions={{ headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#fff" }}>
				<Stack.Screen name="splash" options={{ headerShown: false }} />
				<Stack.Screen name="onboarding" options={{ title: "Zorva" }} />
				<Stack.Screen name="auth" options={{ title: "Entrar" }} />
				<Stack.Screen name="index" options={{ title: "Início" }} />
				<Stack.Screen name="cart" options={{ title: "Carrinho" }} />
				<Stack.Screen name="orders/index" options={{ title: "Pedidos" }} />
				<Stack.Screen name="orders/[id]" options={{ title: "Pedido" }} />
				<Stack.Screen name="payment" options={{ title: "Pagamento" }} />
				<Stack.Screen name="product/[id]" options={{ title: "Produto" }} />
				<Stack.Screen name="profile" options={{ title: "Perfil" }} />
			</Stack>
		</I18nProvider>
	);
}