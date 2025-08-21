import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";

interface CartItem { id: string; product_id: string; quantity: number; price_cents: number }

export default function CartScreen() {
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		setLoading(true);
		try {
			const res = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/carts/me");
			const json = await res.json();
			setItems(json.items ?? []);
		} catch (e) { console.error(e); } finally { setLoading(false); }
	}
	useEffect(() => { load(); }, []);

	const total = items.reduce((s, i) => s + i.price_cents * i.quantity, 0);

	async function checkout() {
		try {
			const res = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/carts/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ origin: { lat: -23.55, lng: -46.63 }, destination: { lat: -23.559, lng: -46.658 }, payment_method: "cash" }) });
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error || "Falha no checkout");
			Alert.alert("Pedido criado", `ID: ${json.order.id}`);
		} catch (e: any) { Alert.alert("Erro", e.message); }
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Carrinho</Text>
			{loading ? <Text>Carregando...</Text> : (
				<FlatList data={items} keyExtractor={(i) => i.id} renderItem={({ item }) => (
					<View style={styles.row}>
						<Text style={{ flex: 1 }}>{item.product_id.slice(0,6)}</Text>
						<Text>x{item.quantity}</Text>
						<Text>R$ {(item.price_cents/100).toFixed(2)}</Text>
					</View>
				)} />
			)}
			<View style={styles.summary}><Text style={{ fontWeight: "700" }}>Total</Text><Text>R$ {(total/100).toFixed(2)}</Text></View>
			<TouchableOpacity style={styles.btn} onPress={checkout}><Text style={styles.btnText}>Finalizar pedido</Text></TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 12 },
	title: { fontSize: 22, fontWeight: "700" },
	row: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
	summary: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
	btn: { backgroundColor: "#16a34a", padding: 14, borderRadius: 12, alignItems: "center" },
	btnText: { color: "#fff", fontWeight: "800" }
});