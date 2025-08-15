import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

interface OrderRow { id: string; status: string; amount: number }

export default function Index() {
	const [orders, setOrders] = useState<OrderRow[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		setLoading(true);
		try {
			const res = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/orders");
			const json = await res.json();
			setOrders((json.orders ?? []).slice(0, 10));
		} catch (e) { console.error(e); } finally { setLoading(false); }
	}

	useEffect(() => { load(); }, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Pedidos recentes</Text>
			{loading ? <Text>Carregando...</Text> : (
				<FlatList
					data={orders}
					keyExtractor={(i) => i.id}
					renderItem={({ item }) => (
						<View style={styles.listItem}>
							<Text style={{ flex: 1 }}>{item.id.slice(0,8)} • {item.status}</Text>
							<Text>R$ {(item.amount / 100).toFixed(2)}</Text>
							<Button title="Aceitar" onPress={() => {}} />
						</View>
					)}
				/>
			)}
			<Button title="Atualizar" onPress={load} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 24, gap: 12, paddingTop: 64 },
	title: { fontSize: 24, fontWeight: "600" },
	listItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 }
});