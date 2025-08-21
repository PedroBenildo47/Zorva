import { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Splash() {
  const fade = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 0, duration: 800, delay: 400, useNativeDriver: true }),
    ]).start(() => router.replace("/onboarding"));
  }, [fade]);
  return (
    <View style={styles.screen}>
      <Animated.Text style={[styles.logo, { opacity: fade }]}>ZORVA</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" },
  logo: { fontSize: 42, fontWeight: "900", letterSpacing: 6, color: "#f97316" },
});