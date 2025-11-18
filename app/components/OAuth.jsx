import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Chromium } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'; // Import the Google provider hook
import * as AuthSession from 'expo-auth-session'; // Import AuthSession utility
import { GoogleAuthProvider, signInWithCredential, getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react'; // useEffect is required for the hook response
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice'; 

// Closing the browser tab after login in Expo Go
WebBrowser.maybeCompleteAuthSession(); [1]

const OAuth = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // 1. Define the dynamic redirect URI
  // This uses Expo's proxy tunnel to handle the callback
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true }); [1]
  
  // 2. Configure Google OAuth using the hook
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '1059269521389-tgejo1uk7ed2hvkc4mn5oeh6rru81aag.apps.googleusercontent.com', 
    iosClientId: '7614502371-g1vqr5cch92vjjvk8snahv88hp52r6vg.apps.googleusercontent.com',
    redirectUri, // Uses the dynamic Expo redirect URI
  });

  // 3. Handle the response and integrate with Firebase/Redux
  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === 'success' && response.authentication) {
        
        dispatch(signInStart()); // Set loading state

        try {
          // The expo-auth-session flow provides an access token
          const { accessToken } = response.authentication;
          
          // Use the access token to create a Firebase credential
          const credential = GoogleAuthProvider.credential(null, accessToken);
          
          // Sign in to Firebase
          const userCredential = await signInWithCredential(getAuth(), credential);

          // SUCCESS: Dispatch user data to Redux
          dispatch(signInSuccess({
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            photo: userCredential.user.photoURL,
          }));

          // Navigate to Home
          navigation.replace('/Home'); 

        } catch (error) {
          // FAILURE: Handle Firebase errors
          console.error("Firebase Sign-In Failed:", error);
          dispatch(signInFailure(error.message || 'Firebase sign-in failed.'));
        }
      } else if (response?.type === 'cancel') {
          // Handle user cancelling the sign-in prompt
          dispatch(signInFailure('Sign in cancelled by user.'));
      }
    };

    signInWithGoogle();
  }, [response]); // Rerun effect whenever the response object changes

  return (
    <View style={styles.socialContainer}>
      <TouchableOpacity
        style={styles.socialButton}
        // promptAsync triggers the browser popup when the button is pressed [1]
        onPress={() => promptAsync({ useProxy: true })} 
        disabled={!request} // Disable button until request object is ready [1]
      >
        <Chromium size={20} color="white" />
        <Text style={styles.socialText}>Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OAuth

const styles = StyleSheet.create({
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
});