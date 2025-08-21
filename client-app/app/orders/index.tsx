import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface Row { id: string; status: string; amount: number; created_at?: string }

export default function Orders() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => {
    try { const res = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/orders"); const json = await res.json(); setItems(json.orders ?? []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  })(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      {loading ? <Text>Carregando...</Text> : (
        <FlatList data={items} keyExtractor={(i)=>i.id} renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={{ flex: 1 }}>{item.id.slice(0,8)}</Text>
            <Text style={{ textTransform: "capitalize" }}>{item.status}</Text>
            <Text>R$ {(item.amount/100).toFixed(2)}</Text>
          </View>
        )} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "800" },
  row: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
});