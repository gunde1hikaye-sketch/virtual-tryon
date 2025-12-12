import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const bgImage = require("../(tabs)/cosmic_bg.png");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);

    const saved = await AsyncStorage.getItem("auth_user");
    if (!saved) {
      setError("Kayıt bulunamadı. Önce kayıt ol.");
      return;
    }

    const { email: savedEmail, passHash } = JSON.parse(saved) as {
      email: string;
      passHash: string;
    };

    const e = email.trim().toLowerCase();
    if (e !== savedEmail) {
      setError("Email veya şifre yanlış.");
      return;
    }

    const inputHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pw
    );

    if (inputHash !== passHash) {
      setError("Email veya şifre yanlış.");
      return;
    }

    await AsyncStorage.setItem("auth_session", JSON.stringify({ email: savedEmail }));
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} resizeMode="cover" style={styles.bg}>
        <View style={styles.darkLayer} />

        <View style={styles.card}>
          <Text style={styles.title}>Giriş Yap</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="ornek@mail.com"
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />

          <Text style={styles.label}>Şifre</Text>
          <TextInput
            value={pw}
            onChangeText={setPw}
            secureTextEntry
            placeholder="Şifren"
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={onLogin} activeOpacity={0.9}>
            <Text style={styles.primaryBtnText}>Giriş</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => router.replace("/(auth)/register")}
          >
            <Text style={styles.linkText}>Hesabın yok mu? Kayıt ol</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  bg: { flex: 1, justifyContent: "center", alignItems: "center" },
  darkLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },

  card: {
    width: "88%",
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  title: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 12 },

  label: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "800", marginTop: 10 },

  input: {
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  error: { marginTop: 10, color: "#ffb4b4", fontWeight: "700" },

  primaryBtn: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#1E88E5",
  },

  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "900" },

  linkBtn: { marginTop: 12, alignItems: "center" },
  linkText: { color: "rgba(255,255,255,0.85)", fontWeight: "800" },
});
