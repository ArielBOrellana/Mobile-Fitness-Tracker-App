import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useDispatch } from 'react-redux';
// import { signInSuccess } from '../../redux/user/userSlice'; // Import your actual action

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Use useRouter for imperative navigation (like after a login function)
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = () => {
    // --- TODO: Add your real API call here ---
    
    // const user = await api.login(email, password);
    // dispatch(signInSuccess(user)); 
    
    // After Redux is updated, we manually push to Home to ensure a smooth transition
    router.replace("/(tabs)/Home");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo & Welcome */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>💪</Text>
          </View>
          <Text style={styles.title}>FitnessTracker</Text>
          <Text style={styles.subtitle}>Welcome Back!</Text>
        </View>

        {/* Email Input */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputBox}>
                <TextInput 
                  style={styles.inputText}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                />
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
                <TextInput 
                  style={styles.inputText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry 
                  placeholder="Enter your password"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>

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
  container: {
    flex: 1,
    backgroundColor: "#4338CA",
  },
  scrollContent: {
    padding: 24,
  },
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
    paddingLeft: 16,
  },
  inputText: {
    color: "#111827",
    height: 48,
    width: '100%',
  },
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
    color: "#fff"
  },
});