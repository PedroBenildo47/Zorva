import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Active() {
  const [status, setStatus] = useState<"accepted"|"enroute"|"delivered">("accepted");
  function advance() {
    setStatus((s) => s === "accepted" ? "enroute" : s === "enroute" ? "delivered" : "delivered");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrega ativa</Text>
      <View style={styles.mapPlaceholder}><Text style={{ color: "#94a3b8" }}>MAPA</Text></View>
      <Text style={{ color: "#e5e7eb" }}>Status: {status}</Text>
      <TouchableOpacity style={styles.btn} onPress={advance}><Text style={styles.btnText}>Avançar status</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: "#0f172a", padding: 16, gap: 12 },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  mapPlaceholder: { flex:1, backgroundColor: "#111827", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  btn: { backgroundColor: "#22c55e", padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" },
});