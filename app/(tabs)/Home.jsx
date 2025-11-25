import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Home as HomeIcon,
  Plus,
  BarChart3,
  Search,
  Settings,
  Flame,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';

const { width } = Dimensions.get('window');

// --- Custom Component Equivalents ---

// 1. Card Component
const Card = ({ children, style, contentStyle }) => (
  <View style={[styles.cardContainer, style]}>
    <View style={[styles.cardContent, contentStyle]}>{children}</View>
  </View>
);

// 2. Badge Component
const Badge = ({ children, variant = 'default', style }) => {
  const badgeStyle = variant === 'secondary' ? styles.badgeSecondary : styles.badgeDefault;
  const textStyle = variant === 'secondary' ? styles.badgeSecondaryText : styles.badgeDefaultText;
  
  return (
    <View style={[styles.badge, badgeStyle, style]}>
      <Text style={[styles.badgeText, textStyle]}>{children}</Text>
    </View>
  );
};

// 3. Progress Component
const Progress = ({ value, style, barStyle }) => {
  const progressWidth = `${value > 100 ? 100 : value}%`;
  return (
    <View style={[styles.progressBackground, style]}>
      <View style={[styles.progressBar, { width: progressWidth }, barStyle]} />
    </View>
  );
};

// --- Main Dashboard Component ---

export default function Home() {

  const { currentUser } = useSelector((state) => state.user)

  // Mock data for the Workouts by Type chart
  const workoutCategories = [
    { name: 'Strength', count: 6, color: '#F59E0B', percent: '33%' }, // amber-500
    { name: 'Running', count: 5, color: '#3B82F6', percent: '28%' }, // blue-500
    { name: 'Yoga', count: 3, color: '#10B981', percent: '17%' }, // emerald-500
    { name: 'Stretching', count: 2, color: '#8B5CF6', percent: '11%' }, // violet-500
    { name: 'Sports', count: 2, color: '#EC4899', percent: '11%' }, // pink-500
  ];
  
  // Mock data for Recent Workouts
  const recentWorkouts = [
    { icon: '🏋️', name: 'Upper Body Strength', category: 'Strength', duration: '45 min', date: 'Today' },
    { icon: '🏃', name: 'Morning Run', category: 'Running', duration: '30 min', date: 'Today' },
    { icon: '🧘', name: 'Evening Yoga', category: 'Yoga', duration: '60 min', date: 'Yesterday' },
    { icon: '🤸', name: 'Full Body Stretch', category: 'Stretching', duration: '20 min', date: 'Yesterday' }
  ];

  return (
    <View style={styles.appContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{`Hello, ${currentUser.username}! 💪`}</Text>
            <Text style={styles.subtitle}>Keep crushing your goals!</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Monthly Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryLabel}>Days Worked Out</Text>
              <Text style={styles.summaryValue}>18/25</Text>
            </View>
            <View style={styles.summaryIconBox}>
              <Flame size={32} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.progressSection}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressText}>{`Goal: ${currentUser.monthlyGoal}`}</Text>
              <Text style={styles.progressText}>Remaining: 7 days</Text>
            </View>
            <Progress 
              value={72} 
              style={styles.progressBg}
              barStyle={styles.progressBarFill}
            />
            <View style={styles.progressTextRowSmall}>
              <Text style={styles.progressTextSmall}>72% complete</Text>
              <Text style={styles.progressTextSmall}>9 days left in month</Text>
            </View>
          </View>
        </Card>

        {/* Workouts by Type */}
        <Card style={styles.defaultCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Workouts by Type</Text>
            <Badge variant="secondary">January 2025</Badge>
          </View>
          
          <View style={styles.chartSection}>
            {/* Pie Chart Mockup (using View components) */}
            <View style={styles.chartMockup}>
              {/* This is a simple visual ring placeholder instead of complex SVG */}
              <View style={styles.chartRingOuter}>
                 <View style={styles.chartRingInner} />
              </View>
            </View>
            
            {/* Legend */}
            <View style={styles.legendContainer}>
              {workoutCategories.map((category) => (
                <View key={category.name} style={styles.legendRow}>
                  <View style={styles.legendItemLeft}>
                    <View style={[styles.legendColorDot, { backgroundColor: category.color }]} />
                    <Text style={styles.legendName}>{category.name}</Text>
                  </View>
                  <View style={styles.legendItemRight}>
                    <Text style={styles.legendCount}>{category.count} sessions</Text>
                    <Text style={styles.legendPercent}>{category.percent}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Recent Workouts */}
        <Card style={styles.defaultCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Workouts</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentWorkoutsList}>
            {recentWorkouts.map((workout, index) => (
              <View key={index} style={styles.workoutRow}>
                <View style={styles.workoutIconBox}>
                  <Text style={styles.workoutIcon}>{workout.icon}</Text>
                </View>
                <View style={styles.workoutDetails}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <View style={styles.workoutMeta}>
                    <Badge style={styles.workoutCategoryBadge}>{workout.category}</Badge>
                    <Text style={styles.workoutDate}>{workout.date}</Text>
                  </View>
                </View>
                <View style={styles.workoutDuration}>
                  <Text style={styles.workoutDurationText}>{workout.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.quickStatsGrid}>
          <Card style={styles.quickStatCard}>
            <View style={styles.quickStatContent}>
              <View style={styles.streakIconBg}>
                <Flame size={20} color="#EA580C" /> 
              </View>
              <Text style={styles.quickStatLabel}>Current Streak</Text>
              <Text style={styles.quickStatValueOrange}>5 days</Text>
            </View>
          </Card>
          <Card style={styles.quickStatCard}>
            <View style={styles.quickStatContent}>
              <View style={styles.trendIconBg}>
                <TrendingUp size={20} color="#10B981" /> 
              </View>
              <Text style={styles.quickStatLabel}>vs Last Month</Text>
              <Text style={styles.quickStatValueGreen}>+22%</Text>
            </View>
          </Card>
        </View>
        
        {/* Extra margin for space above the bottom tab bar, handled by Expo Router tabs */}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Note: The bottom navigation bar is typically handled by Expo Router's (tabs) layout, 
          so this code block is commented out to avoid conflict, but the styles are kept 
          if you need a custom nav. 
      */}
      {/* <View style={styles.bottomNav}>
        {[
          { icon: Home, label: 'Home', active: true, screen: 'Home' },
          { icon: Plus, label: 'Add', screen: 'Add' },
          { icon: BarChart3, label: 'Analytics', screen: 'Analytics' },
          { icon: Search, label: 'Search', screen: 'Search' },
          { icon: Settings, label: 'Settings', screen: 'Settings' }
        ].map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.navItem, 
              item.active ? styles.navItemActive : styles.navItemInactive
            ]}
          >
            <item.icon size={24} color={item.active ? '#4F46E5' : '#6B7280'} />
            <Text style={[styles.navText, item.active ? styles.navTextActive : styles.navTextInactive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View> 
      */}
    </View>
  );
}

// Tab options for expo-router tab bar (file-system routing)
export const options = {
  title: 'Home',
  tabBarLabel: 'Home',
  tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
};

const styles = StyleSheet.create({
  // Global Layout
  appContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  scrollContent: {
    padding: 16, // p-4
    paddingTop: 32, // pt-8 for better iPhone notch clearance
    paddingBottom: 24,
    gap: 24, // space-y-6
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8, // pt-2
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: '600', // font-semibold
    color: '#1F2937', // text-gray-900
  },
  subtitle: {
    color: '#4B5563', // text-gray-600
    fontSize: 14, // text-sm
  },
  addButton: {
    width: 48, // w-12
    height: 48, // h-12
    backgroundColor: '#4F46E5', // bg-indigo-600
    borderRadius: 16, // rounded-2xl
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

  // Card Components (Custom Equivalents)
  cardContainer: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  
  // Badge Component
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999, // full
    alignSelf: 'flex-start',
  },
  badgeSecondary: {
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  badgeSecondaryText: {
    color: '#4B5563', // text-gray-600
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
  },

  // Monthly Summary Card (Specific styles)
  summaryCard: {
    backgroundColor: '#4F46E5', // bg-indigo-600 base
    overflow: 'hidden', // Required for gradient effect visibility 
    // Manual pseudo-gradient using shadow and specific color since RN doesn't support CSS gradients easily
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24, // mb-6
    paddingHorizontal: 8, // Adjust content padding for better look
    paddingTop: 8,
  },
  summaryLabel: {
    color: '#E0E7FF', // text-indigo-100
    fontSize: 14, // text-sm
  },
  summaryValue: {
    fontSize: 36, // text-4xl
    fontWeight: '700', // font-bold
    color: '#FFFFFF',
  },
  summaryIconBox: {
    padding: 12, // p-3
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
    borderRadius: 16, // rounded-2xl
  },

  // Progress Section
  progressSection: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 12, // space-y-3
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14, // text-sm
    color: '#E0E7FF', // text-indigo-100
  },
  progressTextRowSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12, // text-xs
    color: '#E0E7FF',
  },
  progressText: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  progressTextSmall: {
    fontSize: 12,
    color: '#E0E7FF',
  },
  progressBackground: {
    height: 12, // h-3
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF', // Fill color
    borderRadius: 9999,
  },
  
  // Workouts by Type Card
  defaultCard: {
    shadowOpacity: 0.08,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // mb-4
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600', // font-semibold
    color: '#1F2937', // text-gray-900
  },
  
  chartSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap-4
  },
  chartMockup: {
    width: width * 0.35, // Approx 32x32 based on phone width
    height: width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartRingOuter: {
    width: '90%',
    height: '90%',
    borderRadius: 999,
    backgroundColor: '#F3F4F6', // light gray background
    borderWidth: 10,
    borderColor: '#4F46E5', // Indigo color for simple fill
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  chartRingInner: {
    width: '50%',
    height: '50%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  
  legendContainer: {
    flex: 1,
    gap: 12, // space-y-3
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
  },
  legendColorDot: {
    width: 12, // w-3
    height: 12, // h-3
    borderRadius: 9999,
  },
  legendName: {
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    color: '#374151', // text-gray-700
  },
  legendItemRight: {
    alignItems: 'flex-end',
  },
  legendCount: {
    fontSize: 14, // text-sm
    fontWeight: '600', // font-semibold
    color: '#1F2937', // text-gray-900
  },
  legendPercent: {
    fontSize: 12, // text-xs
    color: '#6B7280', // text-gray-500
  },
  
  // Recent Workouts
  viewAllText: {
    fontSize: 14, // text-sm
    color: '#4F46E5', // text-indigo-600
    fontWeight: '500', // font-medium
  },
  recentWorkoutsList: {
    gap: 12, // space-y-3
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap-4
    padding: 12, // p-3
    borderRadius: 12, // rounded-xl
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  workoutIconBox: {
    width: 40, // w-10
    height: 40, // h-10
    borderRadius: 12, // rounded-xl
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  workoutIcon: {
    fontSize: 18, // text-lg
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontWeight: '500', // font-medium
    color: '#1F2937', // text-gray-900
    fontSize: 14, // text-sm
    marginBottom: 2,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  workoutCategoryBadge: {
    paddingHorizontal: 8, // px-2
    paddingVertical: 1, // py-0
    borderRadius: 4,
    backgroundColor: '#E0E7FF', // indigo-100
  },
  workoutDate: {
    fontSize: 12, // text-xs
    color: '#6B7280', // text-gray-500
  },
  workoutDuration: {
    alignItems: 'flex-end',
  },
  workoutDurationText: {
    fontWeight: '600', // font-semibold
    color: '#1F2937', // text-gray-900
  },

  // Quick Stats Grid
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16, // gap-4
  },
  quickStatCard: {
    flex: 1,
    shadowOpacity: 0.08,
    elevation: 2,
  },
  quickStatContent: {
    padding: 16, // p-4
    alignItems: 'center', // text-center
  },
  streakIconBg: {
    width: 40, // w-10
    height: 40, // h-10
    backgroundColor: '#FFF7ED', // orange-100
    borderRadius: 16, // rounded-2xl
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12, // mb-3
  },
  trendIconBg: {
    width: 40,
    height: 40,
    backgroundColor: '#ECFDF5', // green-100
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickStatLabel: {
    fontSize: 12, // text-xs
    color: '#6B7280', // text-gray-500
    marginBottom: 4, // mb-1
  },
  quickStatValueOrange: {
    fontWeight: '600', // font-semibold
    color: '#EA580C', // text-orange-600
  },
  quickStatValueGreen: {
    fontWeight: '600',
    color: '#10B981', // text-green-600
  },
  
  // Bottom Navigation (Styles kept for reference if you implement a custom bar)
  bottomNav: {
    height: 80, // h-20
    backgroundColor: '#FFFFFF', // bg-white
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // border-gray-200
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16, // px-4
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4, // gap-1
    paddingVertical: 8, // py-2
    paddingHorizontal: 12, // px-3
    borderRadius: 8, // rounded-lg
  },
  navItemActive: {
    backgroundColor: '#EEF2FF', // bg-indigo-50
    color: '#4F46E5', // text-indigo-600
  },
  navItemInactive: {
    color: '#6B7280', // text-gray-500
  },
  navText: {
    fontSize: 12, // text-xs
    fontWeight: '500', // font-medium
  },
  navTextActive: {
    color: '#4F46E5',
  },
  navTextInactive: {
    color: '#6B7280',
  },
});