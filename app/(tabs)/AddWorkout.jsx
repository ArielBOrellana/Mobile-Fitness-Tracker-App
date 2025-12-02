import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useState, useRef, useCallback } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { router, useFocusEffect } from 'expo-router';

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
  const { currentUser } = useSelector((state) => state.user); // Get the current user from Redux

  // API URL resolution using env var or app.json extra
  const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    Constants.manifest?.extra?.apiUrl ||
    "http://192.168.1.13:3000";

  const [formData, setFormData] = useState({
        type: 'Strength', 
        name: '', 
        duration: 30, 
        date: new Date(), 
        time: new Date(), 
        intensity: 'Moderate', 
        notes: ''
    });

  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [tempHours, setTempHours] = useState(0);
  const [tempMinutes, setTempMinutes] = useState(30);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const [timePickerKey, setTimePickerKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const workoutCategories = [
    { icon: '🏋️', name: 'Strength' },
    { icon: '🏃', name: 'Running' },
    { icon: '🏊‍♂️', name: 'Swimming' },
    { icon: '🤸', name: 'Stretching' },
    { icon: '⚽', name: 'Sports' },
    { icon: '🚴', name: 'Cycling' }
  ];

  const intensityLevels = ['Light', 'Moderate', 'Intense'];

  // Reset form when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setFormData({
        type: 'Strength',
        name: '',
        duration: 30,
        date: new Date(),
        time: new Date(),
        intensity: 'Moderate',
        notes: ''
      });
      setTimePickerKey(prev => prev + 1);
    }, [])
  );

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open duration picker modal
  const openDurationPicker = () => {
    const hours = Math.floor(formData.duration / 60);
    const minutes = formData.duration % 60;
    setTempHours(hours);
    setTempMinutes(minutes);
    setShowDurationPicker(true);
  };

  // Confirm duration selection from modal and update form data with total minutes
  const confirmDuration = () => {
    const totalMinutes = tempHours * 60 + tempMinutes;
    handleChange('duration', totalMinutes);
    setShowDurationPicker(false);
  };

  // Format duration in "X hr Y min" format
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  const openDatePicker = () => {
    // Create a fresh date object from formData.date
    const dateToUse = formData.date instanceof Date ? new Date(formData.date.getTime()) : new Date();
    setTempDate(dateToUse);
    setShowDatePicker(true);
  };

  const openTimePicker = () => {
    // Use the existing time from formData if valid, otherwise use current time
    let timeToUse;
    if (formData.time instanceof Date && !isNaN(formData.time.getTime())) {
      timeToUse = new Date(formData.time.getTime());
    } else {
      timeToUse = new Date();
    }
    
    setTempTime(timeToUse);
    setTimePickerKey(prev => prev + 1);
    setShowTimePicker(true);
  };

  const confirmDate = () => {
    handleChange('date', tempDate);
    setShowDatePicker(false);
  };

  const confirmTime = () => {
    handleChange('time', tempTime);
    setShowTimePicker(false);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setTempTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Select date';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (time) => {
    if (!time) return 'Select time';
    const timeObj = time instanceof Date ? time : new Date(time);
    return timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    if (formData.duration <= 0) {
      Alert.alert('Error', 'Please select a valid duration');
      return;
    }

    setLoading(true);

    try {
      // Combine date and time into a single datetime in local timezone
      const dateObj = formData.date instanceof Date ? formData.date : new Date(formData.date);
      const timeObj = formData.time instanceof Date ? formData.time : new Date(formData.time);
      
      // Create a new date with the selected date and time in local timezone
      const combinedDate = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        timeObj.getHours(),
        timeObj.getMinutes(),
        0,
        0
      );

      // Adjust for timezone offset to store the actual local time as UTC
      const timezoneOffset = combinedDate.getTimezoneOffset() * 60000; // offset in milliseconds
      const localTimeAsUTC = new Date(combinedDate.getTime() - timezoneOffset);

      const workoutData = {
        type: formData.type,
        name: formData.name.trim(),
        duration: formData.duration,
        date: localTimeAsUTC.toISOString(),
        intensity: formData.intensity,
        notes: formData.notes.trim(),
        userRef: currentUser._id,
      };

      const response = await fetch(`${API_URL}/api/workout/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(workoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create workout');
      }

      // Success - reset form and navigate to home
      setFormData({
        type: 'Strength',
        name: '',
        duration: 30,
        date: new Date(),
        time: new Date(),
        intensity: 'Moderate',
        notes: ''
      });
      Alert.alert('Success', 'Workout added successfully!');
      router.push('/Home');
    } catch (error) {
      console.error('Error creating workout:', error);
      Alert.alert('Error', error.message || 'Failed to create workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
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
                    formData.type === category.name ? styles.categoryItemSelected : styles.categoryItemDefault
                  ]}
                  onPress={() => handleChange('type', category.name)}
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
              <TextInput 
                style={styles.textInputText}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Enter workout name"
              />
            </View>
          </CardContent>
        </StyledCard>

        {/* Duration Input */}
        <StyledCard>
          <CardContent>
            <Text style={styles.label}>Duration *</Text>
            <TouchableOpacity 
              style={styles.durationInputContainer}
              onPress={openDurationPicker}
            >
              <Icons.Clock size={24} color="#9CA3AF" style={styles.durationIcon} />
              <View style={styles.durationInputMock}>
                <Text style={styles.durationText}>{formatDuration(formData.duration)}</Text>
              </View>
            </TouchableOpacity>
          </CardContent>
        </StyledCard>

        {/* Time and Date */}
        <View style={styles.dateTimeRow}>
          <StyledCard style={styles.dateTimeCard}>
            <CardContent style={styles.dateTimeContent}>
              <Text style={styles.dateTimeLabel}>Time</Text>
              <TouchableOpacity 
                style={styles.dateTimeInputMock}
                onPress={openTimePicker}
              >
                <Text style={styles.dateTimeText}>🕐 {formatTime(formData.time)}</Text>
              </TouchableOpacity>
            </CardContent>
          </StyledCard>
          <StyledCard style={styles.dateTimeCard}>
            <CardContent style={styles.dateTimeContent}>
              <Text style={styles.dateTimeLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.dateTimeInputMock}
                onPress={openDatePicker}
              >
                <Text style={styles.dateTimeText}>{formatDate(formData.date)}</Text>
              </TouchableOpacity>
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
                    formData.intensity === level ? styles.intensityItemSelected : styles.intensityItemDefault
                  ]}
                  onPress={() => handleChange('intensity', level)} 
                >
                  <Text style={[
                    styles.intensityText,
                    formData.intensity === level ? styles.intensityTextSelected : styles.intensityTextDefault
                  ]}>
                    {level}
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
              <TextInput 
                style={styles.textInputText}
                value={formData.notes}
                onChangeText={(text) => handleChange('notes', text)}
                placeholder="Focused on chest and triceps..."
                multiline
              />
            </View>
          </CardContent>
        </StyledCard>

        {/* Submit Button */}
        <View style={styles.submitButtonWrapper}>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding Workout...' : 'Add Workout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Duration Picker Modal */}
      <Modal
        visible={showDurationPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDurationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Duration</Text>
            </View>
            
            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hours</Text>
                <Picker
                  selectedValue={tempHours}
                  onValueChange={(value) => setTempHours(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {[...Array(24).keys()].map((hour) => (
                    <Picker.Item key={hour} label={hour.toString()} value={hour} />
                  ))}
                </Picker>
              </View>
              
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minutes</Text>
                <Picker
                  selectedValue={tempMinutes}
                  onValueChange={(value) => setTempMinutes(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {[...Array(60).keys()].map((minute) => (
                    <Picker.Item key={minute} label={minute.toString()} value={minute} />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDurationPicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDuration}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
            </View>
            
            <View style={styles.dateTimePickerContainer}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                maximumDate={new Date(2100, 11, 31)}
                minimumDate={new Date(2020, 0, 1)}
                themeVariant="light"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDate}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
            </View>
            
            <View style={styles.dateTimePickerContainer}>
              <DateTimePicker
                key={`time-picker-${timePickerKey}`}
                testID="dateTimePicker"
                value={tempTime}
                mode="time"
                display="spinner"
                onChange={onTimeChange}
                themeVariant="light"
                minuteInterval={1}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmTime}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    paddingTop: 8,
    marginBottom: 8,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
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
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },

  // --- Duration Picker Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  picker: {
    width: 100,
    height: 150,
  },
  pickerItem: {
    fontSize: 18,
    color: '#111827',
  },
  dateTimePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 216,
  },
  dateTimePicker: {
    width: '100%',
    height: 216,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  timePicker: {
    width: 80,
    height: 150,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#4338CA',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
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