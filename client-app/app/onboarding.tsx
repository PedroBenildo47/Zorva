import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Onboarding() {
	return (
		<View style={styles.container}>
			<Text style={styles.logo}>ZORVA</Text>
			<Text style={styles.subtitle}>Entrega rápida, segura e inteligente.</Text>
			<Image source={{ uri: "https://images.unsplash.com/photo-1520975930462-6b36d3e90cdd?w=1200&q=80" }} style={styles.hero} />
			<View style={{ height: 24 }} />
			<Link href="/auth" asChild>
				<TouchableOpacity style={styles.btnPrimary}><Text style={styles.btnText}>Começar</Text></TouchableOpacity>
			</Link>
			<Link href="/index" asChild>
				<TouchableOpacity style={styles.btnGhost}><Text style={[styles.btnText,{color:'#0f172a'}]}>Explorar</Text></TouchableOpacity>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" },
	logo: { fontSize: 40, fontWeight: "800", letterSpacing: 4, color: "#2563eb" },
	subtitle: { color: "#334155", marginTop: 8 },
	hero: { width: "100%", height: 220, borderRadius: 16, marginTop: 16 },
	btnPrimary: { backgroundColor: "#2563eb", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, width: "100%", alignItems: "center" },
	btnGhost: { backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, width: "100%", alignItems: "center", marginTop: 8, borderWidth:1, borderColor:'#e2e8f0' },
	btnText: { color: "#fff", fontWeight: "700" }
});