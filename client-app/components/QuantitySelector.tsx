import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function QuantitySelector({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(value + 1);
  return (
    <View style={styles.wrap}>
      <TouchableOpacity onPress={dec} style={styles.btn}><Text style={styles.btnText}>−</Text></TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity onPress={inc} style={styles.btn}><Text style={styles.btnText}>＋</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 12 },
  btn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" },
  btnText: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  value: { fontSize: 16, fontWeight: "700" },
});