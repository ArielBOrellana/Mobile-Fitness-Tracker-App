import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons, Feather } from 'expo-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Alert, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { signInSuccess } from '../../redux/user/userSlice';

// --- Utility Components (React Native) ---

const IconWrapper = ({ children }) => (
  <View style={{ padding: 8, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', elevation: 1, shadowOpacity: 0.05, shadowRadius: 2 }}>
    {children}
  </View>
);

// Toggle component (React Native Switch Mockup)
const ToggleSwitch = ({ enabled }) => (
  <View style={{
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: enabled ? '#4F46E5' : '#D1D5DB',
    justifyContent: 'center',
  }}>
    <View style={{
      width: 20,
      height: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      position: 'absolute',
      left: enabled ? 26 : 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 2,
    }} />
  </View>
);

// --- Main Profile/Settings Component (React Native) ---

export default function Profile() {
  const preferences = [
    { icon: 'notifications', title: 'Push Notifications', description: 'Get reminded to workout', enabled: false },
    { icon: 'track-changes', title: 'Goal Alerts', description: 'Alert when reaching milestones', enabled: true }
  ];

  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch();

  // API URL resolution using env var or app.json extra
  const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    Constants.manifest?.extra?.apiUrl ||
    "http://192.168.1.13:3000";

  const [goalValue, setGoalValue] = useState(currentUser?.monthlyGoal ?? 0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setGoalValue(currentUser?.monthlyGoal ?? 0);
  }, [currentUser]);

  const handleSaveGoal = async () => {
    if (!currentUser?._id) {
      Alert.alert('Not signed in', 'Please sign in to update your profile');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: currentUser?.token ? `Bearer ${currentUser.token}` : undefined,
        },
        body: JSON.stringify({ monthlyGoal: Number(goalValue) }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || res.statusText || 'Update failed');
      }

      const updated = await res.json();
      // Keep token in store
      const payload = { ...updated, token: currentUser.token };
      dispatch(signInSuccess(payload));
      Alert.alert('Saved', 'Monthly goal updated');
    } catch (err) {
      console.error('Update error', err);
      Alert.alert('Error', err.message || 'Could not update goal');
    } finally {
      setSaving(false);
    }
  };

  const initialGoal = currentUser?.monthlyGoal ?? 0;
  const isDirty = Number(goalValue) !== Number(initialGoal);
  
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Header */}
        <View>
          <Text style={styles.headerText}>Profile & Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.card}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="person" size={20} color="#4B5563" />
              <Text style={styles.sectionTitle}>User Profile</Text>
            </View>
            
            <View style={{ flexDirection: 'column', gap: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{currentUser.username[0]}</Text>
                </View>

                <View style={{ flex: 1, gap: 16 }}>
                  {/* Username */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={[styles.inputValue, { backgroundColor: 'transparent', borderWidth: 0, paddingVertical: 8 }]}> 
                      <Text style={{ color: '#111827', fontSize: 16, fontWeight: '500' }}>{currentUser.username}</Text>
                    </View>
                  </View>
                  
                  {/* Monthly Goal (editable) */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Monthly Goal</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[styles.inputValue, { flex: 1 }]}> 
                        <TextInput
                          value={String(goalValue)}
                          onChangeText={(t) => setGoalValue(t.replace(/[^0-9]/g, ''))}
                          keyboardType="numeric"
                          style={{ color: '#111827', fontSize: 16 }}
                          placeholder="0"
                        />
                      </View>
                      {(isDirty || saving) && (
                        <TouchableOpacity
                          onPress={handleSaveGoal}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            backgroundColor: saving ? '#7C3AED' : '#4F46E5',
                            borderRadius: 8,
                          }}
                          disabled={saving}
                        >
                          <Text style={{ color: '#fff', fontWeight: '600' }}>{saving ? 'Saving...' : 'Save'}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>{String(goalValue)} workouts/month</Text>
                  </View>
                </View>
              </View>
            </View>
        </View>


        {/* App Preferences 
            Make this interactive later
        */}
        <View style={styles.card}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="settings" size={20} color="#4B5563" />
              <Text style={styles.sectionTitle}>App Preferences</Text>
            </View>
            
            <View style={{ gap: 16 }}>
              {preferences.map((pref, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <IconWrapper>
                      <MaterialIcons name={pref.icon} size={20} color="#4B5563" />
                    </IconWrapper>
                    <View>
                      <Text style={{ fontWeight: '600', color: '#111827' }}>{pref.title}</Text>
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>{pref.description}</Text>
                    </View>
                  </View>
                  <ToggleSwitch enabled={pref.enabled} />
                </View>
              ))}
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

// --- Component Styles ---
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  contentContainer: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 96,
    gap: 24,
  },
  
  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 12, // rounded-xl
    padding: 24, // p-6
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // shadow-lg
  },

  // Header Styles
  headerText: {
    fontSize: 24, // text-2xl
    fontWeight: '600', // font-semibold
    color: '#111827', // text-gray-900
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // border-gray-100
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  // Profile Specific Styles
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#4F46E5', // bg-indigo-600
    borderRadius: 16, // rounded-2xl
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginRight: 24,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  inputContainer: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563', // text-gray-600
  },
  inputValue: {
    padding: 12,
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#E5E7EB', // border-gray-200
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
    marginLeft: 4,
  },
});