import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function History() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { (async () => {
    try { const res = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/orders"); const json = await res.json(); setRows((json.orders ?? []).slice(0,10)); } catch (e) {}
  })(); }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <FlatList data={rows} keyExtractor={(i)=>i.id} renderItem={({ item }) => (
        <View style={styles.row}><Text style={{ color: "#e5e7eb", flex:1 }}>{item.id.slice(0,8)}</Text><Text style={{ color: "#a3a3a3" }}>{item.status}</Text></View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: "#0f172a", padding: 16, gap: 12 },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1f2937" },
});