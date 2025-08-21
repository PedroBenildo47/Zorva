import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido {String(id).slice(0,8)}</Text>
      <View style={styles.timeline}>
        {(["Recebido","A caminho","Entregue"]).map((s, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={[styles.dot,{ backgroundColor: i===2?"#16a34a":"#2563eb" }]} />
            <Text>{s}</Text>
          </View>
        ))}
      </View>
      <View style={styles.map}><Text>Mapa (em breve)</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "800" },
  timeline: { gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  map: { flex: 1, backgroundColor: "#e2e8f0", borderRadius: 12, alignItems: "center", justifyContent: "center" },
});