import { View, Text, StyleSheet } from "react-native";

export default function Header({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>ZORVA</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, marginBottom: 8 },
  brand: { color: "#2563eb", fontWeight: "900", letterSpacing: 2, fontSize: 12 },
  title: { fontSize: 22, fontWeight: "700" },
});