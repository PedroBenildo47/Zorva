import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function Index() {
	const [origin, setOrigin] = useState("-23.5505,-46.6333");
	const [destination, setDestination] = useState("-23.5596,-46.6588");
	const [result, setResult] = useState<string>("");

	async function quote() {
		try {
			const [olat, olng] = origin.split(",").map((n) => parseFloat(n.trim()));
			const [dlat, dlng] = destination.split(",").map((n) => parseFloat(n.trim()));
			const res = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					customer_id: "00000000-0000-0000-0000-000000000000",
					origin: { lat: olat, lng: olng },
					destination: { lat: dlat, lng: dlng },
					payment_method: "cash",
				}),
			});
			const json = await res.json();
			if (res.ok) setResult(`Estimativa: R$ ${(json.order.amount / 100).toFixed(2)} (\n${json.order.id})`);
			else setResult(JSON.stringify(json, null, 2));
		} catch (e: any) {
			setResult(String(e?.message ?? e));
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Zorva Cliente</Text>
			<TextInput style={styles.input} value={origin} onChangeText={setOrigin} placeholder="Origem lat,lng" />
			<TextInput style={styles.input} value={destination} onChangeText={setDestination} placeholder="Destino lat,lng" />
			<Button title="Calcular e criar pedido" onPress={quote} />
			{result ? <Text style={styles.result}>{result}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 24, gap: 12, justifyContent: "center" },
	title: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
	input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8 },
	result: { marginTop: 12, fontFamily: "monospace" },
});