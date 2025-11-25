import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from 'expo-vector-icons';

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
    { icon: 'nights-stay', title: 'Dark Mode', description: 'Switch to dark theme', enabled: false },
    { icon: 'notifications', title: 'Push Notifications', description: 'Get reminded to workout', enabled: true },
    { icon: 'track-changes', title: 'Goal Alerts', description: 'Alert when reaching milestones', enabled: true }
  ];
  
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        {/* Header */}
        <View style={{ paddingTop: 8 }}>
          <Text style={styles.headerText}>Settings & Profile</Text>
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
                  <Text style={styles.avatarText}>SA</Text>
                </View>

                <View style={{ flex: 1, gap: 16 }}>
                  {/* Full Name */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={styles.inputValue}>
                      <Text style={styles.textValue}>Sarah Anderson</Text>
                    </View>
                  </View>
                  
                  {/* Monthly Goal */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Monthly Goal</Text>
                    <View style={styles.inputValue}>
                      <Text style={styles.textValue}>25 workouts/month</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="edit" size={16} color="#4F46E5" />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
        </View>

        {/* App Preferences */}
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

        {/* App Info */}
        <View style={{...styles.card, padding: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>FitnessTracker v2.1.0</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity>
                <Text style={{ color: '#4F46E5', fontSize: 14 }}>Terms of Service</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ color: '#4F46E5', fontSize: 14 }}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ color: '#4F46E5', fontSize: 14 }}>Help & Support</Text>
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
    fontSize: 28,
    fontWeight: '800', // font-extrabold
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