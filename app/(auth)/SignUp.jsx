import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import Constants from 'expo-constants';

export default function SignUp() {
  // Form state for username, email, and password
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // API URL from environment or fallback
  const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    Constants.manifest?.extra?.apiUrl ||
    "http://192.168.1.13:3000";

  // Update form field values
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    // Validate all fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      // Send signup request to backend
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Handle registration errors
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody.message || res.statusText || "Sign up failed";
        setLoading(false);
        Alert.alert("Sign Up Failed", message);
        return;
      }

      const data = await res.json().catch(() => ({}));

      setLoading(false);
      // Navigate to sign in screen after successful registration
      Alert.alert("Success", "Account created! Please sign in.");
      router.replace("/(auth)/SignIn");
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>💪</Text>
          </View>
          <Text style={styles.title}>FitnessTracker</Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={formData.username}
                  onChangeText={(text) => handleChange("username", text)}
                  placeholder="Choose a username"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                  secureTextEntry
                  placeholder="Create a password"
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#4338CA" />
          ) : (
            <Text style={styles.loginText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Link href="/SignIn" style={styles.signInLink}>
              Sign In
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4338CA" },
  scrollContent: { padding: 24 },
  logoContainer: { marginTop: 48, marginBottom: 32, alignItems: "center" },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    elevation: 6,
  },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", marginBottom: 4 },
  subtitle: { color: "#E0E7FF" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    elevation: 3,
  },
  cardContent: { padding: 16 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 8 },
  inputWrapper: { position: "relative" },
  inputBox: {
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    paddingLeft: 16,
  },
  inputText: { color: "#111827", height: 48, width: "100%" },
  loginButton: {
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    marginTop: 24,
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.7 },
  loginText: { color: "#4338CA", fontSize: 18, fontWeight: "600" },
  signInContainer: { alignItems: "center", paddingTop: 16 },
  signInText: { color: "rgba(255,255,255,0.9)" },
  signInLink: {
    fontWeight: "600",
    textDecorationLine: "underline",
    color: "#fff",
  },
});
