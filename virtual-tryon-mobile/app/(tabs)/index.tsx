import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import LottieView from "../../components/Lottie";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ProfileMenu from "../../components/tryon/ProfileMenu";
import ImagePickerCard from "../../components/tryon/ImagePickerCard";
import ResultCard from "../../components/tryon/ResultCard";

const bgImage = require("./cosmic_bg.png");
const loadingAnimation = require("../../assets/animations/loading.json");

export default function HomeScreen() {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [tshirtImage, setTshirtImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (setter: (v: string) => void) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Galeri iznine izin vermen gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // (Expo uyarısı çıkabilir, önemli değil)
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;

    // ✅ 413 (Payload Too Large) hatasını çözmek için: küçült + sıkıştır
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 640 } }],
      {
        compress: 0.25,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    if (!manipulated.base64) {
      alert("Fotoğraf işlenemedi (base64 oluşmadı).");
      return;
    }

    const finalBase64 = "data:image/jpeg;base64," + manipulated.base64;

    console.log("🧩 Compressed base64 length:", finalBase64.length);

    setter(finalBase64);
  };

  const generateTryOn = async () => {
    console.log("▶️ generateTryOn çağrıldı");

    if (!modelImage || !tshirtImage) {
      console.log("❌ Eksik görsel:", {
        modelImage: !!modelImage,
        tshirtImage: !!tshirtImage,
      });
      alert("Lütfen iki fotoğrafı da seç!");
      return;
    }

    console.log("✅ Görseller hazır");
    console.log("📸 modelImage length:", modelImage.length);
    console.log("👕 tshirtImage length:", tshirtImage.length);

    setLoading(true);
    console.log("⏳ Loading true");

    try {
      console.log("🌍 API isteği gönderiliyor...");

      const payload = {
        modelImage,
        tshirtImage,
        generateVideo: false,
      };

      console.log("📦 Request payload keys:", Object.keys(payload));

      const response = await fetch("https://mertinan-tryon.vercel.app/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📡 Response status:", response.status);

      // ✅ JSON değilse patlamasın diye önce text okuyup logla
      if (!response.ok) {
        const text = await response.text();
        console.log("❌ Non-OK response text:", text.slice(0, 500));
        alert(`API hata döndürdü (status: ${response.status}).`);
        return;
      }

      const data = await response.json();
      console.log("📥 Response data:", data);

      if (data.imageUrl) {
        console.log("🖼 imageUrl alındı:", data.imageUrl);
        setResultImage(data.imageUrl);
      } else {
        console.log("⚠️ imageUrl yok!", data);
        alert("API imageUrl döndürmedi!");
      }
    } catch (err) {
      console.log("🔥 FETCH HATASI:", err);
      alert("Bağlantı hatası!");
    } finally {
      setTimeout(() => {
        console.log("⏹ Loading false");
        setLoading(false);
      }, 1200);
    }
  };

  const canGenerate = !!modelImage && !!tshirtImage && !loading;

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} resizeMode="cover" style={styles.bg}>
        <View style={styles.darkLayer} />

        <ProfileMenu top={50} left={16} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.overlay}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Virtual Try-On Mobile</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fotoğrafları Yükle</Text>
            <Text style={styles.cardDesc}>
              Kartlara dokunarak fotoğraf seçebilirsin.
            </Text>

            <View style={styles.previewGrid}>
              <ImagePickerCard
                label="MODEL"
                imageUri={modelImage}
                onPress={() => pickImage(setModelImage)}
              />
              <ImagePickerCard
                label="TİŞÖRT"
                imageUri={tshirtImage}
                onPress={() => pickImage(setTshirtImage)}
              />
            </View>

            <TouchableOpacity
              style={[styles.generateButton, !canGenerate && { opacity: 0.65 }]}
              onPress={generateTryOn}
              disabled={!canGenerate}
              activeOpacity={0.9}
            >
              {loading ? (
                <LottieView
                  autoPlay
                  loop
                  style={{ width: 58, height: 58 }}
                  source={loadingAnimation}
                />
              ) : (
                <Text style={styles.generateButtonText}>Generate Try-On</Text>
              )}
            </TouchableOpacity>
          </View>

          {resultImage ? (
            <ResultCard
              resultImage={resultImage}
              onClear={() => setResultImage(null)}
            />
          ) : null}

          <View style={{ height: 24 }} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  bg: { flex: 1 },
  darkLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  overlay: {
    paddingTop: 60,
    paddingBottom: 28,
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 14,
  },

  card: {
    width: "88%",
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 16,
  },

  cardTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },

  cardDesc: {
    marginTop: 6,
    marginBottom: 12,
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    lineHeight: 18,
  },

  previewGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: 14,
  },

  generateButton: {
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E88E5",
  },

  generateButtonText: { color: "#fff", fontSize: 18, fontWeight: "900" },
});
