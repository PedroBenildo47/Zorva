import { TouchableOpacity, Text, StyleSheet } from "react-native";
export default function Button({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.btn}>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({ btn: { backgroundColor: "#22c55e", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 }, label: { color: "#fff", fontWeight: "800" } });