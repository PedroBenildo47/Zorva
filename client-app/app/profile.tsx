import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useI18n } from "../i18n";

export default function Profile() {
  const { lang, setLang } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Telefone" value={phone} onChangeText={setPhone} style={styles.input} />
      <Text style={{ marginTop: 12, fontWeight: "700" }}>Idioma</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["en","pt","ru"] as const).map((l) => (
          <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.lang, lang===l && styles.langActive]}><Text style={{ color: lang===l?"#fff":"#0f172a" }}>{l.toUpperCase()}</Text></TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "800" },
  input: { borderWidth: 1, borderColor: "#cbd5e1", padding: 12, borderRadius: 10 },
  lang: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: "#e2e8f0" },
  langActive: { backgroundColor: "#2563eb" },
});