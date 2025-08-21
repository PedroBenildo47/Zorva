import { View, Text, TouchableOpacity } from "react-native";
import { useI18n } from "../i18n";

export default function DriverProfile() {
  const { lang, setLang } = useI18n();
  return (
    <View style={{ flex:1, backgroundColor: "#0f172a", padding: 16, gap: 12 }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>Perfil</Text>
      <Text style={{ color: "#e5e7eb" }}>Idioma</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["en","pt","ru"] as const).map((l) => (
          <TouchableOpacity key={l} onPress={() => setLang(l)} style={{ backgroundColor: lang===l?"#22c55e":"#111827", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 }}>
            <Text style={{ color: "#fff" }}>{l.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}