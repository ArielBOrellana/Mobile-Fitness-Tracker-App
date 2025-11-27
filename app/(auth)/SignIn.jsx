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
import Constants from 'expo-constants';
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";

// Read API URL from environment variable, then app.json config, then hardcoded fallback
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  Constants.manifest?.extra?.apiUrl ||
  "http://192.168.1.13:3000";
// ---------------------------------

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.user);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const TIMEOUT_MS = 5000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Login request timed out")), TIMEOUT_MS)
    );

    try {
      dispatch(signInStart());

      console.log("Attempting login to:", `${API_URL}/api/auth/signin`);

      const res = await Promise.race([
        fetch(`${API_URL}/api/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }),
        timeoutPromise,
      ]);

      // If server responded with non-2xx, try to read JSON error body and show it
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody.message || res.statusText || "Login failed";
        dispatch(signInFailure(message));
        Alert.alert("Login Failed", message);
        return;
      }

      const data = await res.json();

      // Compatibility: backend error responses use { success: false, message }
      if (data && data.success === false) {
        dispatch(signInFailure(data.message));
        Alert.alert("Login Failed", data.message);
        return;
      }

      // On success the backend returns the user object + token
      dispatch(signInSuccess(data));
      router.replace("/(tabs)/Home");
    } catch (error) {
      dispatch(signInFailure(error.message));
      // Detailed error logging
      console.error("LOGIN ERROR:", error.message);
      Alert.alert(
        "Network Error",
        `Could not connect to:\n${API_URL}\n\nError: ${error.message}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- DEBUG BUTTON (Remove later) --- */}
        <View
          style={{
            marginBottom: 20,
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text
            style={{ textAlign: "center", fontWeight: "bold", marginBottom: 5 }}
          >
            Debug Tools
          </Text>
          {/* Displaying the hardcoded URL for verification */}
          <Text style={{ textAlign: "center", fontSize: 12, marginBottom: 5 }}>
            Current URL: {API_URL}
          </Text>
          <Button title="Run Connection Test" onPress={runConnectionTests} />
        </View>
        {/* ----------------------------------- */}

        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>💪</Text>
          </View>
          <Text style={styles.title}>FitnessTracker</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
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
                  placeholder="Enter your password"
                />
              </View>
            </View>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#4338CA" />
          ) : (
            <Text style={styles.loginText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don’t have an account?{" "}
            <Link href="/SignUp" style={styles.signInLink}>
              Sign Up
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
  errorText: { color: "#FCA5A5", textAlign: "center", marginBottom: 16 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.3)" },
  dividerText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginHorizontal: 8,
  },
  signUpContainer: { alignItems: "center", paddingTop: 16 },
  signUpText: { color: "rgba(255,255,255,0.9)" },
  signInLink: {
    fontWeight: "600",
    textDecorationLine: "underline",
    color: "#fff",
  },
});
