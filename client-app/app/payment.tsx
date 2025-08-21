import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function Payment() {
  const [method, setMethod] = useState<"card" | "paypal" | "mbway">("card");
  const [card, setCard] = useState({ number: "", exp: "", cvv: "" });

  function pay() {
    Alert.alert("Pagamento", `Método: ${method}`, [{ text: "OK" }]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento</Text>
      <View style={styles.methods}>
        {(["card","paypal","mbway"] as const).map((m) => (
          <TouchableOpacity key={m} onPress={() => setMethod(m)} style={[styles.method, method===m && styles.methodActive]}><Text style={{ color: method===m?"#fff":"#0f172a", fontWeight: "700" }}>{m.toUpperCase()}</Text></TouchableOpacity>
        ))}
      </View>
      {method === "card" && (
        <View style={{ gap: 10 }}>
          <TextInput placeholder="Card Number" style={styles.input} keyboardType="number-pad" value={card.number} onChangeText={(v)=>setCard({ ...card, number: v })} />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput placeholder="MM/YY" style={[styles.input,{ flex:1 }]} value={card.exp} onChangeText={(v)=>setCard({ ...card, exp:v })} />
            <TextInput placeholder="CVV" style={[styles.input,{ flex:1 }]} secureTextEntry value={card.cvv} onChangeText={(v)=>setCard({ ...card, cvv:v })} />
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.btn} onPress={pay}><Text style={styles.btnText}>Pagar agora</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "800" },
  methods: { flexDirection: "row", gap: 8, marginVertical: 8 },
  method: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: "#e2e8f0" },
  methodActive: { backgroundColor: "#2563eb" },
  input: { borderWidth: 1, borderColor: "#cbd5e1", padding: 12, borderRadius: 10 },
  btn: { backgroundColor: "#16a34a", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontWeight: "800" },
});