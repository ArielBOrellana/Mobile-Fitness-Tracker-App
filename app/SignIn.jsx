import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Chromium } from "lucide-react-native";
import { Link } from "expo-router";

const SignIn = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo & Welcome */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>💪</Text>
          </View>
          <Text style={styles.title}>FitnessTracker</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        {/* Email Input */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputBox}>
                <TextInput />
              </View>
            </View>
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputBox}>
                <TextInput secureTextEntry />
              </View>
            </View>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <View style={styles.socialButton}>
            <Chromium size={20} color="white" />
            <Text style={styles.socialText}>Google</Text>
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Don’t have an account?{" "}
            <Link href="/SignUp" style={styles.signUpLink}>
              Sign Up
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: "#4338CA", // Indigo-700
  },
  scrollContent: {
    padding: 24,
  },

  // Logo
  logoContainer: {
    marginTop: 48,
    marginBottom: 32,
    alignItems: "center",
  },
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
  logoEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    color: "#E0E7FF",
  },

  // Card (email/password boxes)
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
  },
  inputBox: {
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    paddingLeft: 44,
  },
  inputText: {
    color: "#111827",
  },

  // Login button
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
  loginText: {
    color: "#4338CA",
    fontSize: 18,
    fontWeight: "600",
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dividerText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginHorizontal: 8,
  },

  // Social buttons
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 4,
  },
  socialText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 8,
  },

  // Sign up link
  signUpContainer: {
    alignItems: "center",
    paddingTop: 16,
  },
  signUpText: {
    color: "rgba(255,255,255,0.9)",
  },
  signUpLink: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Terms & privacy
  termsContainer: {
    alignItems: "center",
    marginTop: 32,
    paddingBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  link: {
    textDecorationLine: "underline",
  },
});
