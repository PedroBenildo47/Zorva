import { View, Text } from "react-native";

export default function RatingStars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} style={{ color: i < full ? "#f59e0b" : "#cbd5e1", fontSize: 16 }}>★</Text>
      ))}
    </View>
  );
}