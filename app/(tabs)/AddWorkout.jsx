import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
// Using Feather from @expo/vector-icons as a close alternative to lucide-react
import { Feather } from '@expo/vector-icons';

// Mapping lucide-react-like names to Feather icons for usage consistency.
// Each entry is a small component wrapper so we can use <Icons.X size={} color={} />
const Icons = {
  Clock: (props) => <Feather name="clock" {...props} />,
};

// Component for a styled block/card
const StyledCard = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

// Component for a simple button/touchable area
const CardContent = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>
    {children}
  </View>
);

export default function AddWorkout() {
  const workoutCategories = [
    { icon: '🏋️', name: 'Strength', selected: true },
    { icon: '🏃', name: 'Running', selected: false },
    { icon: '🧘', name: 'Yoga', selected: false },
    { icon: '🤸', name: 'Stretching', selected: false },
    { icon: '⚽', name: 'Sports', selected: false },
    { icon: '🚴', name: 'Cycling', selected: false }
  ];

  const intensityLevels = [
    { label: 'Light', selected: false },
    { label: 'Moderate', selected: true },
    { label: 'Intense', selected: false }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Scrollable Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Workout</Text>
        </View>

        {/* Workout Type Selection */}
        <StyledCard>
          <CardContent>
            <Text style={styles.label}>Workout Type *</Text>
            <View style={styles.categoryGrid}>
              {workoutCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryItem,
                    category.selected ? styles.categoryItemSelected : styles.categoryItemDefault
                  ]}
                  // Placeholder onPress
                  onPress={() => console.log('Select category:', category.name)} 
                >
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </StyledCard>

        {/* Workout Name */}
        <StyledCard>
          <CardContent>
            <Text style={styles.label}>Workout Name *</Text>
            <View style={styles.textInputMock}>
              <Text style={styles.textInputText}>Upper Body Strength</Text>
            </View>
          </CardContent>
        </StyledCard>

        {/* Duration Input */}
        <StyledCard>
          <CardContent>
            <Text style={styles.label}>Duration *</Text>
            <View style={styles.durationInputContainer}>
              <Icons.Clock size={24} color="#9CA3AF" style={styles.durationIcon} />
              <View style={styles.durationInputMock}>
                <Text style={styles.durationText}>45 min</Text>
              </View>
            </View>
          </CardContent>
        </StyledCard>

        {/* Date and Time */}
        <View style={styles.dateTimeRow}>
          <StyledCard style={styles.dateTimeCard}>
            <CardContent style={styles.dateTimeContent}>
              <Text style={styles.dateTimeLabel}>Date</Text>
              <View style={styles.dateTimeInputMock}>
                <Text style={styles.dateTimeText}>Jan 30, 2025</Text>
              </View>
            </CardContent>
          </StyledCard>
          <StyledCard style={styles.dateTimeCard}>
            <CardContent style={styles.dateTimeContent}>
              <Text style={styles.dateTimeLabel}>Time</Text>
              <View style={styles.dateTimeInputMock}>
                <Text style={styles.dateTimeText}>🕐 8:00 AM</Text>
              </View>
            </CardContent>
          </StyledCard>
        </View>

        {/* Intensity Level */}
        <StyledCard>
          <CardContent>
            <Text style={styles.label}>Intensity Level</Text>
            <View style={styles.intensityRow}>
              {intensityLevels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.intensityItem,
                    level.selected ? styles.intensityItemSelected : styles.intensityItemDefault
                  ]}
                  // Placeholder onPress
                  onPress={() => console.log('Select intensity:', level.label)} 
                >
                  <Text style={[
                    styles.intensityText,
                    level.selected ? styles.intensityTextSelected : styles.intensityTextDefault
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </StyledCard>

        {/* Notes */}
        <StyledCard>
          <CardContent>
            <Text style={styles.label}>Notes (Optional)</Text>
            <View style={styles.notesInputMock}>
              <Text style={styles.notesText}>Focused on chest and triceps...</Text>
            </View>
          </CardContent>
        </StyledCard>

        {/* Submit Button */}
        <View style={styles.submitButtonWrapper}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Add Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  scrollContent: {
    padding: 16, // p-4
    paddingTop: 48, // increased for consistent header spacing
    paddingBottom: 64, // Extra padding for content above bottom nav
  },
  
  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24, // space-y-6 roughly
    paddingTop: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6', // bg-gray-100
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16, // gap-4
  },
  headerTitle: {
    fontSize: 24, // text-2xl
    fontWeight: '600', // font-semibold
    color: '#111827', // text-gray-900
  },

  // --- Cards/Sections ---
  card: {
    backgroundColor: '#FFFFFF', // bg-white
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 24, // space-y-6 equivalent
  },
  cardContent: {
    padding: 24, // p-6
  },
  label: {
    fontSize: 18, // text-lg
    fontWeight: '500', // font-medium
    color: '#1F2937', // text-gray-900
    marginBottom: 16, // mb-4
  },

  // --- Workout Type Selection ---
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // roughly gap-3 equivalent
  },
  categoryItem: {
    width: '48%', // grid-cols-2 equivalent (adjust for gap)
    padding: 16, // p-4
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'left',
  },
  categoryItemDefault: {
    borderColor: '#E5E7EB', // border-gray-200
    backgroundColor: '#FFFFFF', // bg-white
  },
  categoryItemSelected: {
    borderColor: '#4F46E5', // border-indigo-600
    backgroundColor: '#EEF2FF', // bg-indigo-50
    // ring-2 ring-indigo-200 is visually replaced by border color/background
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
  },
  categoryIcon: {
    fontSize: 24, // text-2xl
  },
  categoryName: {
    fontWeight: '500', // font-medium
    fontSize: 14, // text-sm
    color: '#4B5563', // text-gray-700
  },
  
  // --- Workout Name ---
  textInputMock: {
    height: 48, // h-12
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderRadius: 12, // rounded-xl
    borderWidth: 2,
    borderColor: '#4F46E5', // border-indigo-600
    justifyContent: 'center',
    paddingHorizontal: 16, // px-4
  },
  textInputText: {
    color: '#1F2937', // text-gray-900
  },

  // --- Duration Input ---
  durationInputContainer: {
    position: 'relative',
  },
  durationIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    zIndex: 1,
    transform: [{ translateY: -12 }], // Half of size 24
  },
  durationInputMock: {
    height: 64, // h-16
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderRadius: 12, // rounded-xl
    borderWidth: 2,
    borderColor: '#4F46E5', // border-indigo-600
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 32, // pl-8 to offset the icon
  },
  durationText: {
    fontSize: 30, // text-3xl
    fontWeight: '700', // font-bold
    color: '#1F2937', // text-gray-900
  },

  // --- Date and Time ---
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16, // gap-4
    marginBottom: 24, // space-y-6 equivalent
  },
  dateTimeCard: {
    flex: 1,
    marginBottom: 0, // Override default margin
  },
  dateTimeContent: {
    padding: 16, // p-4
  },
  dateTimeLabel: {
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    color: '#4B5563', // text-gray-700
    marginBottom: 8, // mb-2
  },
  dateTimeInputMock: {
    height: 40, // h-10
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    justifyContent: 'center',
    paddingHorizontal: 12, // px-3
  },
  dateTimeText: {
    fontSize: 14, // text-sm
    color: '#1F2937', // text-gray-900
  },

  // --- Intensity Level ---
  intensityRow: {
    flexDirection: 'row',
    gap: 12, // gap-3
  },
  intensityItem: {
    flex: 1, // flex-1
    height: 48, // h-12
    borderRadius: 12, // rounded-xl
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityItemDefault: {
    borderColor: '#E5E7EB', // border-gray-200
    backgroundColor: '#FFFFFF', // bg-white
  },
  intensityItemSelected: {
    borderColor: '#4F46E5', // border-indigo-600
    backgroundColor: '#EEF2FF', // bg-indigo-50
  },
  intensityText: {
    fontWeight: '500', // font-medium
  },
  intensityTextDefault: {
    color: '#4B5563', // text-gray-700
  },
  intensityTextSelected: {
    color: '#4F46E5', // text-indigo-600
  },

  // --- Notes ---
  notesInputMock: {
    height: 80, // h-20
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    padding: 16, // p-4
  },
  notesText: {
    fontSize: 14, // text-sm
    color: '#6B7280', // text-gray-500
  },

  // --- Submit Button ---
  submitButtonWrapper: {
    paddingVertical: 16, // pt-4 pb-6 roughly
  },
  submitButton: {
    width: '100%', // w-full
    height: 56, // h-14
    backgroundColor: '#4F46E5', // bg-indigo-600
    borderRadius: 12, // rounded-xl
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // shadow-lg
  },
  submitButtonText: {
    fontSize: 18, // text-lg
    fontWeight: '500', // font-medium
    color: '#FFFFFF', // text-white
  },

  // --- Bottom Navigation ---
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // h-20
    backgroundColor: '#FFFFFF', // bg-white
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // border-t border-gray-200
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16, // px-4
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8, // py-2
    paddingHorizontal: 12, // px-3
    borderRadius: 8, // rounded-lg
    gap: 4, // gap-1
  },
  navItemDefault: {
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#EEF2FF', // bg-indigo-50
  },
  navText: {
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
  },
  navTextDefault: {
    color: '#6B7280', // text-gray-500
  },
  navTextActive: {
    color: '#4F46E5', // text-indigo-600
  },
});