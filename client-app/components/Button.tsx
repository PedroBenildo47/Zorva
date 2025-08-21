import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle } from "react-native";

interface Props {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = "primary", style, disabled }: Props) {
  const bg = {
    primary: "#2563eb",
    secondary: "#f97316",
    success: "#16a34a",
    danger: "#ef4444",
  }[variant];
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onPress} disabled={disabled} style={[styles.base, { backgroundColor: bg, opacity: disabled ? 0.6 : 1 }, style]}>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8 },
  label: { color: "#fff", fontWeight: "800", letterSpacing: 0.3 },
});