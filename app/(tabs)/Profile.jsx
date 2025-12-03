import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from 'expo-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Alert, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { signInSuccess, signOutUserSuccess } from '../../redux/user/userSlice';
import { router } from 'expo-router';

// --- Main Profile/Settings Component (React Native) ---

export default function Profile() {

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
      // Update only the necessary user fields and keep token
      const payload = {
        _id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        monthlyGoal: updated.monthlyGoal,
        token: currentUser.token,
      };
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
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Profile & Settings</Text>
          </View>
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

        {/* Account Actions */}
        <View style={styles.card}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="security" size={20} color="#4B5563" />
              <Text style={styles.sectionTitle}>Account</Text>
            </View>
            
            <View style={{ gap: 12 }}>
              {/* Sign Out Button */}
              <TouchableOpacity 
                style={styles.signOutButton}
                onPress={() => {
                  Alert.alert(
                    'Sign Out',
                    'Are you sure you want to sign out?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Sign Out', 
                        style: 'destructive',
                        onPress: () => {
                          dispatch(signOutUserSuccess());
                          router.replace('/(auth)/SignIn');
                        }
                      }
                    ]
                  );
                }}
              >
                <View style={styles.buttonContent}>
                  <MaterialIcons name="exit-to-app" size={20} color="#4F46E5" />
                  <Text style={styles.signOutButtonText}>Sign Out</Text>
                </View>
              </TouchableOpacity>

              {/* Delete Account Button */}
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    'Delete Account',
                    'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Delete', 
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            const res = await fetch(`${API_URL}/api/user/delete/${currentUser._id}`, {
                              method: 'DELETE',
                              headers: {
                                Authorization: currentUser?.token ? `Bearer ${currentUser.token}` : undefined,
                              },
                            });
                            
                            if (!res.ok) {
                              throw new Error('Failed to delete account');
                            }
                            
                            dispatch(signOutUserSuccess());
                            router.replace('/(auth)/SignIn');
                            Alert.alert('Success', 'Your account has been deleted');
                          } catch (err) {
                            console.error('Delete error', err);
                            Alert.alert('Error', 'Could not delete account');
                          }
                        }
                      }
                    ]
                  );
                }}
              >
                <View style={styles.buttonContent}>
                  <MaterialIcons name="delete" size={20} color="#DC2626" />
                  <Text style={styles.deleteButtonText}>Delete Account</Text>
                </View>
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  signOutButton: {
    padding: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  deleteButton: {
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});