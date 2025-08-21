import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import QuantitySelector from "../../components/QuantitySelector";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => { (async () => {
    try {
      // naive fetch via products list demo
      // In real world fetch by id endpoint
      const storesRes = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/stores");
      const storeId = (await storesRes.json()).stores?.[0]?.id;
      const res = await fetch(process.env.EXPO_PUBLIC_API_URL + `/api/products/store/${storeId}`);
      const json = await res.json();
      setProduct((json.products ?? []).find((p: any) => p.id === id) || (json.products ?? [])[0]);
    } catch (e) { console.error(e); }
  })(); }, [id]);

  async function addToCart() {
    if (!product) return;
    await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/carts/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: product.id, quantity: qty, price_cents: product.price_cents, store_id: product.store_id }) });
    Alert.alert("Adicionado", "Produto adicionado ao carrinho");
  }

  if (!product) return <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}><Text>Carregando...</Text></View>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.photo_url || "https://picsum.photos/seed/p/800/600" }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>R$ {(product.price_cents/100).toFixed(2)}</Text>
      <QuantitySelector value={qty} onChange={setQty} />
      <TouchableOpacity style={styles.btn} onPress={addToCart}><Text style={styles.btnText}>Adicionar ao carrinho</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  image: { width: "100%", height: 240, borderRadius: 12 },
  name: { fontSize: 20, fontWeight: "800" },
  price: { color: "#2563eb", fontWeight: "700" },
  btn: { backgroundColor: "#2563eb", padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" }
});