import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function DriverAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function login() {
    try {
      const res = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Invalid credentials");
      Alert.alert("OK", "Logged in");
    } catch (e: any) { Alert.alert("Error", e.message); }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zorva Driver</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TouchableOpacity onPress={login} style={styles.btn}><Text style={styles.btnText}>Entrar</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#0f172a", gap: 12, justifyContent: "center" },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  input: { backgroundColor: "#111827", color: "#fff", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#1f2937" },
  btn: { backgroundColor: "#22c55e", padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" }
});