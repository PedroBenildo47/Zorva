import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";

interface Product { id: string; name: string; price_cents: number; photo_url?: string; store_id: string }

export default function Index() {
	const [products, setProducts] = useState<Product[]>([]);
	const router = useRouter();

	useEffect(() => {
		(async () => {
			try {
				// Demo: fetch first store products
				const storesRes = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/stores");
				const storesJson = await storesRes.json();
				const storeId = storesJson.stores?.[0]?.id;
				if (storeId) {
					const res = await fetch(process.env.EXPO_PUBLIC_API_URL + `/api/products/store/${storeId}`);
					const json = await res.json();
					setProducts(json.products ?? []);
				}
			} catch (e) { console.error(e); }
		})();
	}, []);

	async function addToCart(p: Product) {
		await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/carts/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: p.id, quantity: 1, price_cents: p.price_cents, store_id: p.store_id }) });
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Descubra</Text>
			<FlatList
				data={products}
				keyExtractor={(i) => i.id}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Image source={{ uri: item.photo_url || "https://picsum.photos/seed/food/400/300" }} style={styles.image} />
						<View style={{ flex: 1 }}>
							<Text style={styles.name}>{item.name}</Text>
							<Text style={styles.price}>R$ {(item.price_cents/100).toFixed(2)}</Text>
						</View>
						<TouchableOpacity style={styles.btn} onPress={() => addToCart(item)}>
							<Text style={styles.btnText}>Adicionar</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
			<View style={{ height: 12 }} />
			<Link href="/cart" asChild>
				<TouchableOpacity style={styles.checkout}><Text style={styles.checkoutText}>Ver carrinho</Text></TouchableOpacity>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
	title: { fontSize: 22, fontWeight: "700", marginVertical: 8 },
	card: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4 },
	image: { width: 80, height: 80, borderRadius: 12 },
	name: { fontSize: 16, fontWeight: "600" },
	price: { color: "#2563eb", marginTop: 4 },
	btn: { backgroundColor: "#2563eb", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
	btnText: { color: "#fff", fontWeight: "700" },
	checkout: { backgroundColor: "#f97316", padding: 14, borderRadius: 12, alignItems: "center" },
	checkoutText: { color: "#fff", fontWeight: "800" }
});