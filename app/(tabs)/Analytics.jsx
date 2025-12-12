import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useFocusEffect } from 'expo-router';
import Constants from 'expo-constants';

// Reusable UI Components
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const CardContent = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>
    {children}
  </View>
);

const Badge = ({ children, style }) => (
  <View style={[styles.badge, style]}>
    <Text style={styles.badgeText}>{children}</Text>
  </View>
);

export default function Analytics() {
  const { currentUser } = useSelector((state) => state.user); // State for analytics data 
  const [monthlyData, setMonthlyData] = useState([]);  // 7-month workout trend
  const [breakdown, setBreakdown] = useState([]);      // Workout type breakdown
  const [loading, setLoading] = useState(true);
  const [vsLastMonth, setVsLastMonth] = useState(0);   // % change vs last month
  const [mostImproved, setMostImproved] = useState({ type: 'Running', increase: 150 });
  const [bestStreak, setBestStreak] = useState({ days: 8, period: 'Last month' });

  const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    Constants.manifest?.extra?.apiUrl ||
    "http://192.168.1.13:3000";

  const workoutTypeColors = {
    'Strength': '#F59E0B',
    'Running': '#3B82F6',
    'Swimming': '#10B981',
    'Stretching': '#8B5CF6',
    'Sports': '#EC4899',
    'Cycling': '#14B8A6',
  };

  // Fetch workout data for the last 7 months
  useFocusEffect(
    useCallback(() => { 
      const fetchMonthlyWorkouts = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${API_URL}/api/workout`,
            {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            
            // Create array of last 7 months with zero counts
            const now = new Date();
            const months = [];
            for (let i = 6; i >= 0; i--) {
              const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
              months.push({
                year: date.getFullYear(),
                month: date.getMonth(),
                label: date.toLocaleDateString('en-US', { month: 'short' }),
                count: 0
              });
            }

            // Aggregate workouts into monthly counts
            data.workouts.forEach(workout => {
              const workoutDate = new Date(workout.date);
              const monthIndex = months.findIndex(m => 
                m.year === workoutDate.getFullYear() && 
                m.month === workoutDate.getMonth()
              );
              if (monthIndex !== -1) {
                months[monthIndex].count++;
              }
            });

            setMonthlyData(months);

            // Calculate percentage change from last month
            const currentMonthCount = months[6].count;
            const lastMonthCount = months[5].count;
            
            // Avoid division by zero
            if (lastMonthCount > 0) {
              const percentChange = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
              setVsLastMonth(Math.round(percentChange));
            } else if (currentMonthCount > 0) {
              setVsLastMonth(100);
            } else {
              setVsLastMonth(0);
            }

            // Break down workouts by type for current and last month
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

            const typeCounts = {
              thisMonth: {},
              lastMonth: {}
            };

            data.workouts.forEach(workout => { // Count workouts by type for this month and last month
              const workoutDate = new Date(workout.date);
              const workoutMonth = workoutDate.getMonth();
              const workoutYear = workoutDate.getFullYear();
              const type = workout.type;

              if (workoutMonth === currentMonth && workoutYear === currentYear) {
                typeCounts.thisMonth[type] = (typeCounts.thisMonth[type] || 0) + 1;
              } else if (workoutMonth === lastMonth && workoutYear === lastMonthYear) {
                typeCounts.lastMonth[type] = (typeCounts.lastMonth[type] || 0) + 1;
              }
            });

            // Create breakdown array with proper order
            const typeOrder = ['Strength', 'Running', 'Swimming', 'Stretching', 'Sports', 'Cycling'];
            const breakdownData = typeOrder.map(type => ({
              name: type,
              thisMonth: typeCounts.thisMonth[type] || 0,
              lastMonth: typeCounts.lastMonth[type] || 0,
              color: workoutTypeColors[type]
            })).filter(item => item.thisMonth > 0 || item.lastMonth > 0);

            setBreakdown(breakdownData); // Set breakdown state for rendering 

            // Find workout type with highest percentage increase
            let maxIncrease = 0;
            let improvedType = '';
            
            breakdownData.forEach(item => { // Calculate percentage increase for each type 
              if (item.lastMonth > 0) {
                const increase = ((item.thisMonth - item.lastMonth) / item.lastMonth) * 100;
                if (increase > maxIncrease) {
                  maxIncrease = increase;
                  improvedType = item.name;
                }
              } else if (item.thisMonth > 0 && item.lastMonth === 0) {
                const increase = 100;
                if (increase > maxIncrease) {
                  maxIncrease = increase;
                  improvedType = item.name;
                }
              }
            });

            if (improvedType) { // Set most improved workout type state for display 
              setMostImproved({
                type: improvedType,
                increase: Math.round(maxIncrease)
              });
            } else {
              setMostImproved({ type: 'N/A', increase: 0 });
            }

            // Calculate longest consecutive workout streak
            const sortedWorkouts = data.workouts
              .map(w => new Date(w.date))
              .sort((a, b) => a - b);

            let currentStreak = 0;
            let maxStreak = 0;
            let streakStart = null;
            let streakEnd = null;
            let bestStreakStart = null;
            let bestStreakEnd = null;

            for (let i = 0; i < sortedWorkouts.length; i++) {
              if (i === 0) {
                currentStreak = 1;
                streakStart = sortedWorkouts[i];
                streakEnd = sortedWorkouts[i];
              } else {
                const daysDiff = Math.floor((sortedWorkouts[i] - sortedWorkouts[i - 1]) / (1000 * 60 * 60 * 24));
                if (daysDiff <= 1) {
                  currentStreak++;
                  streakEnd = sortedWorkouts[i];
                } else {
                  if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                    bestStreakStart = streakStart;
                    bestStreakEnd = streakEnd;
                  }
                  currentStreak = 1;
                  streakStart = sortedWorkouts[i];
                  streakEnd = sortedWorkouts[i];
                }
              }
            }

            if (currentStreak > maxStreak) {
              maxStreak = currentStreak;
              bestStreakStart = streakStart;
              bestStreakEnd = streakEnd;
            }

            if (maxStreak > 0 && bestStreakStart && bestStreakEnd) {
              const today = new Date();
              const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
              const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
              
              const streakMonth = bestStreakStart.getMonth();
              const streakYear = bestStreakStart.getFullYear();
              const currentMonth = today.getMonth();
              const currentYear = today.getFullYear();
              
              let period;
              
              if (streakMonth === currentMonth && streakYear === currentYear) {
                period = 'This month';
              } else if (streakMonth === currentMonth - 1 && streakYear === currentYear) {
                period = 'Last month';
              } else if (streakMonth === 11 && currentMonth === 0 && streakYear === currentYear - 1) {
                // Handle December of last year when current is January
                period = 'Last month';
              } else {
                period = bestStreakStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              }

              setBestStreak({ days: maxStreak, period: period });
            } else {
              setBestStreak({ days: 0, period: 'No streaks yet' });
            }
          }
        } catch (error) {
          console.error('Error fetching monthly workouts:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMonthlyWorkouts();
    }, [currentUser.token])
  );

  // Mockup chart component 
  const ChartMockup = () => {
    if (loading) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    const maxCount = Math.max(...monthlyData.map(m => m.count), 1);
    const maxHeight = 120;

    // Render bars for each month 
    return (
      <View style={styles.chartContainer}>
        {monthlyData.map((month, index) => {
          const height = month.count > 0 ? (month.count / maxCount) * maxHeight : 0;
          return (
            <View key={index} style={styles.chartBarWrapper}>
              <View style={[styles.chartBar, { height: height || 2 }]} />
            </View>
          );
        })}
        <View style={styles.chartLabels}>
          {monthlyData.map((month, index) => (
            <Text key={index} style={styles.chartLabelText}>{month.label}</Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={styles.toggleGroup}>
          </View>
        </View>

        {/* Monthly Trend Chart */}
        <Card>
          <CardContent>
            <Text style={styles.chartTitle}>Monthly Workout Trend</Text>
            
            <ChartMockup />

            <View style={styles.chartFooter}>
              <View style={styles.chartFooterLeft}>
                <View style={[
                  styles.arrowUpBg, 
                  vsLastMonth < 0 && styles.arrowDownBg
                ]}>
                  <Feather 
                    name={vsLastMonth >= 0 ? "arrow-up" : "arrow-down"} 
                    size={16} 
                    color={vsLastMonth >= 0 ? "#15803D" : "#DC2626"} 
                  />
                </View>
                <Text style={styles.chartFooterText}>
                  {vsLastMonth >= 0 ? '+' : ''}{vsLastMonth}% vs last month
                </Text>
              </View>
              <Badge style={styles.chartBadge}>
                {monthlyData.length > 0 
                  ? `${monthlyData[6].label} ${monthlyData[6].year}`
                  : 'Dec 2025'
                }
              </Badge>
            </View>
          </CardContent>
        </Card>

        {/* Workout Type Breakdown */}
        <Card>
          <CardContent style={styles.breakdownCardContent}>
            <Text style={styles.breakdownTitle}>Workout Type Breakdown</Text>
            
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : breakdown.length > 0 ? (
              <View style={styles.breakdownList}>
                {breakdown.map((category, index) => {
                  const maxValue = Math.max(...breakdown.map(b => Math.max(b.thisMonth, b.lastMonth)), 1);
                  return (
                    <View key={index} style={styles.breakdownItem}>
                      <View style={styles.breakdownStats}>
                        <Text style={styles.breakdownName}>{category.name}</Text>
                        <Text style={styles.breakdownSessions}>{category.thisMonth} sessions</Text>
                      </View>
                      
                      {/* Visual bars: Current Month vs Last Month */}
                      <View style={styles.breakdownBarsRow}>
                        <View style={styles.breakdownBarBg}>
                          {/* Current Month Bar (Primary) */}
                          <View 
                            style={[styles.breakdownBar, { width: `${(category.thisMonth / maxValue) * 100}%`, backgroundColor: category.color }]}
                          />
                        </View>
                        <View style={styles.breakdownBarBg}>
                          {/* Last Month Bar (Secondary) */}
                          <View 
                            style={[styles.breakdownBar, { width: `${(category.lastMonth / maxValue) * 100}%`, backgroundColor: '#9CA3AF' }]}
                          />
                        </View>
                      </View>
                  <View style={styles.breakdownBarLabels}>
                    <View style={styles.breakdownLabelItem}>
                        <View style={[styles.colorDot, { backgroundColor: category.color }]} /> 
                        <Text style={styles.breakdownLabelText}>This Month</Text>
                    </View>
                    <View style={styles.breakdownLabelItem}>
                        <View style={[styles.colorDot, { backgroundColor: '#9CA3AF' }]} />
                        <Text style={styles.breakdownLabelText}>Last Month</Text>
                    </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.emptyText}>No workout data available for this month or last month.</Text>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <View style={styles.statIconBgGreen}>
                <Feather name="trending-up" size={24} color="#16A34A" />
              </View>
              <Text style={styles.statLabel}>Most Improved</Text>
              <Text style={styles.statValue}>{mostImproved.type}</Text>
              {mostImproved.increase > 0 ? (
                <Text style={styles.statChangeGreen}>+{mostImproved.increase}% increase</Text>
              ) : (
                <Text style={styles.statChangeOrange}>No improvement</Text>
              )}
            </CardContent>
          </Card>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <View style={styles.statIconBgOrange}>
                <Feather name="activity" size={24} color="#EA580C" />
              </View>
              <Text style={styles.statLabel}>Best Streak</Text>
              <Text style={styles.statValue}>{bestStreak.days} {bestStreak.days === 1 ? 'Day' : 'Days'}</Text>
              <Text style={styles.statChangeOrange}>{bestStreak.period}</Text>
            </CardContent>
          </Card>
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  toggleGroup: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4F46E5', // indigo-600
    borderRadius: 8,
  },
  activeToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  inactiveToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  inactiveToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },

  // Chart Styles
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  chartContainer: {
    height: 160,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chartBarWrapper: {
    width: 30,
    alignItems: 'center',
  },
  chartBar: {
    width: 10,
    backgroundColor: '#A5B4FC',
    borderRadius: 5,
    marginBottom: 20,
  },
  chartLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chartLabelText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
    backgroundColor: '#EEF2FF', // indigo-50
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E7FF', // indigo-100
  },
  chartFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowUpBg: {
    width: 24,
    height: 24,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowDownBg: {
    backgroundColor: '#FEE2E2',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartFooterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937', // gray-800
  },
  chartBadge: {
    backgroundColor: 'white',
    borderColor: '#C7D2FE', // indigo-200
    borderWidth: 1,
  },

  // Breakdown Styles
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  breakdownList: {
    gap: 24,
  },
  breakdownItem: {
    gap: 8,
  },
  breakdownStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
  },
  breakdownName: {
    fontWeight: '600',
    color: '#374151', // gray-700
  },
  breakdownSessions: {
    color: '#6B7280', // gray-500
  },
  breakdownBarsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  breakdownBarBg: {
    flex: 1,
    height: 14,
    backgroundColor: '#E5E7EB', // gray-200
    borderRadius: 7,
    overflow: 'hidden',
  },
  breakdownBar: {
    height: '100%',
    borderRadius: 7,
  },
  breakdownBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  breakdownLabelText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 24,
  },

  // Summary Stats Styles
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 16,
  },
  statCard: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statIconBgGreen: {
    width: 40,
    height: 40,
    backgroundColor: '#D1FAE5', // green-100
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconBgOrange: {
    width: 40,
    height: 40,
    backgroundColor: '#FFEDD5', // orange-100
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '800',
    fontSize: 20,
    color: '#111827', // gray-900
    marginBottom: 4,
  },
  statChangeGreen: {
    fontSize: 14,
    color: '#16A34A', // green-600
    fontWeight: '600',
  },
  statChangeOrange: {
    fontSize: 14,
    color: '#EA580C', // orange-600
    fontWeight: '600',
  },

  // Badge Styles
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
});