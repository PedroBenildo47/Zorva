import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function login() {
		setLoading(true);
		try {
			const res = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error || "Falha ao entrar");
			// store token if needed
			Alert.alert("Sucesso", "Login efetuado");
			router.replace("/index");
		} catch (e: any) { Alert.alert("Erro", e.message); } finally { setLoading(false); }
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Entrar</Text>
			<TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
			<TextInput placeholder="Senha" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
			<TouchableOpacity style={styles.btn} disabled={loading} onPress={login}><Text style={styles.btnText}>{loading?"Entrando...":"Entrar"}</Text></TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 24, justifyContent: "center", gap: 12 },
	title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
	input: { borderWidth: 1, borderColor: "#cbd5e1", padding: 12, borderRadius: 10 },
	btn: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center" },
	btnText: { color: "white", fontWeight: "700" }
});