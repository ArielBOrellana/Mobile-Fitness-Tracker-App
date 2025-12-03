import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';

export default function SearchFilter() {
  const { currentUser } = useSelector((state) => state.user);
  // Search and filter state
  const [searchText, setSearchText] = useState('');
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});  // Track expanded workout details
  const [activeFilters, setActiveFilters] = useState([]);         // Active quick filters
  const [selectedMonth, setSelectedMonth] = useState(null);       // Selected month filter
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const inputRef = useRef(null);
  const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl ||
    Constants.manifest?.extra?.apiUrl ||
    "http://192.168.1.13:3000";

  const workoutIcons = {
    'Strength': '🏋️',
    'Running': '🏃',
    'Swimming': '🏊‍♂️',
    'Stretching': '🤸',
    'Sports': '⚽',
    'Cycling': '🚴'
  };

  // Load all workouts on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
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
            // Format workouts with date/time strings and sort by date descending
            const formattedWorkouts = data.workouts
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(workout => {
                const workoutDate = new Date(workout.date);
                const dateStr = workoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeStr = workoutDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                return {
                  id: workout._id,
                  icon: workoutIcons[workout.type] || '💪',
                  name: workout.name,
                  category: workout.type,
                  duration: `${workout.duration} min`,
                  date: dateStr,
                  fullDate: workoutDate,
                  time: timeStr,
                  intensity: workout.intensity,
                  notes: workout.notes || ''
                };
              });
            
            setAllWorkouts(formattedWorkouts);
          }
        } catch (error) {
          console.error('Error fetching workouts:', error);
        } finally {
          setLoading(false);
        }
      };

    fetchWorkouts();
  }, []);

  // Extract unique months from workout dates for month filter
  const availableMonths = useMemo(() => {
    const months = new Map();
    allWorkouts.forEach(workout => {
      if (workout.fullDate) {
        const monthYear = `${workout.fullDate.toLocaleString('en-US', { month: 'long' })} ${workout.fullDate.getFullYear()}`;
        if (!months.has(monthYear)) {
          months.set(monthYear, workout.fullDate);
        }
      }
    });
    return Array.from(months.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([monthYear]) => monthYear);
  }, [allWorkouts]);

  // Apply all filters (search, quick filters, month) with memoization
  const filteredWorkouts = useMemo(() => {
    let results = allWorkouts;

    // Filter by search text (name, category, intensity, notes)
    if (searchText.trim()) {
      const lowercaseQuery = searchText.toLowerCase();
      results = results.filter(workout => {
        return (
          workout.name.toLowerCase().includes(lowercaseQuery) ||
          workout.category.toLowerCase().includes(lowercaseQuery) ||
          workout.intensity.toLowerCase().includes(lowercaseQuery) ||
          workout.notes.toLowerCase().includes(lowercaseQuery)
        );
      });
    }

    // Apply quick filters with OR logic within groups, AND between groups
    if (activeFilters.length > 0) {
      // Split filters into time-based and category-based
      const timeFilters = activeFilters.filter(f => 
        ['This Week', 'This Month', 'Last Week', 'Last Month'].includes(f)
      );
      const categoryFilters = activeFilters.filter(f => 
        ['Strength', 'Running'].includes(f)
      );

      // Apply time filters (OR logic - match any time filter)
      if (timeFilters.length > 0) {
        results = results.filter(workout => {
          if (!workout.fullDate) return false;
          
          const workoutDate = workout.fullDate;
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          return timeFilters.some(filter => {
            switch (filter) {
              case 'This Week': {
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                return workoutDate >= weekAgo && workoutDate <= now;
              }
              case 'This Month': {
                return workoutDate.getMonth() === now.getMonth() && 
                       workoutDate.getFullYear() === now.getFullYear();
              }
              case 'Last Week': {
                const lastWeekEnd = new Date(today);
                lastWeekEnd.setDate(today.getDate() - 7);
                const lastWeekStart = new Date(lastWeekEnd);
                lastWeekStart.setDate(lastWeekEnd.getDate() - 7);
                return workoutDate >= lastWeekStart && workoutDate < lastWeekEnd;
              }
              case 'Last Month': {
                const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
                const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
                return workoutDate.getMonth() === lastMonth && 
                       workoutDate.getFullYear() === lastMonthYear;
              }
              default:
                return false;
            }
          });
        });
      }

      // Apply category filters (OR logic - match any category filter)
      if (categoryFilters.length > 0) {
        results = results.filter(workout => {
          return categoryFilters.some(filter => {
            switch (filter) {
              case 'Strength':
                return workout.category.toLowerCase() === 'strength';
              case 'Running':
                return workout.category.toLowerCase() === 'running';
              default:
                return false;
            }
          });
        });
      }
    }

    // Apply month filter
    if (selectedMonth) {
      results = results.filter(workout => {
        if (!workout.fullDate) return false;
        const monthYear = `${workout.fullDate.toLocaleString('en-US', { month: 'long' })} ${workout.fullDate.getFullYear()}`;
        return monthYear === selectedMonth;
      });
    }

    return results;
  }, [searchText, allWorkouts, activeFilters, selectedMonth]);

  // Calculate total duration
  const totalDuration = useMemo(() => {
    return filteredWorkouts.reduce((sum, workout) => {
      return sum + parseInt(workout.duration);
    }, 0);
  }, [filteredWorkouts]);

  // Stable callbacks to prevent re-renders
  const handleTextChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const handleClear = useCallback(() => {
    setSearchText('');
  }, []);

  const toggleWorkoutDetails = useCallback((workoutId) => {
    setExpandedWorkouts(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  }, []);

  const toggleFilter = useCallback((filter) => {
    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
    setSelectedMonth(null);
  }, []);

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

  return (
    <View style={styles.screen}>
      <View style={styles.fixedHeader}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Search & Filter</Text>
          </View>
          <Feather name="filter" size={20} color="#4B5563" />
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBarContainer}>
            <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search workouts by name, type, or intensity..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={handleTextChange}
              onSubmitEditing={() => Keyboard.dismiss()}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            {searchText.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClear}
                activeOpacity={0.7}
              >
                <Feather name="x" size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.filtersRow}>
            {['This Week', 'This Month', 'Strength'].map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  activeFilters.includes(filter) && styles.filterChipActive
                ]}
                onPress={() => toggleFilter(filter)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterChipText,
                  activeFilters.includes(filter) && styles.filterChipTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.filtersRow}>
            {['Last Week', 'Last Month', 'Running'].map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  activeFilters.includes(filter) && styles.filterChipActive
                ]}
                onPress={() => toggleFilter(filter)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterChipText,
                  activeFilters.includes(filter) && styles.filterChipTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Month Selector */}
        {availableMonths.length > 0 && (
          <View style={styles.monthSection}>
            <Text style={styles.monthLabel}>Filter by Month:</Text>
            {availableMonths.length <= 3 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthScrollContent}
              >
                {availableMonths.map(month => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthChip,
                      selectedMonth === month && styles.monthChipActive
                    ]}
                    onPress={() => setSelectedMonth(selectedMonth === month ? null : month)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.monthChipText,
                      selectedMonth === month && styles.monthChipTextActive
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View>
                <TouchableOpacity
                  style={styles.monthDropdownButton}
                  onPress={() => setShowMonthDropdown(!showMonthDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.monthDropdownButtonText}>
                    {selectedMonth || 'Select a month...'}
                  </Text>
                  <Feather 
                    name={showMonthDropdown ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
                {showMonthDropdown && (
                  <View style={styles.monthDropdownList}>
                    <TouchableOpacity
                      style={styles.monthDropdownItem}
                      onPress={() => {
                        setSelectedMonth(null);
                        setShowMonthDropdown(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.monthDropdownItemText,
                        !selectedMonth && styles.monthDropdownItemTextActive
                      ]}>
                        All Months
                      </Text>
                      {!selectedMonth && <Feather name="check" size={16} color="#10B981" />}
                    </TouchableOpacity>
                    {availableMonths.map(month => (
                      <TouchableOpacity
                        key={month}
                        style={styles.monthDropdownItem}
                        onPress={() => {
                          setSelectedMonth(month);
                          setShowMonthDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.monthDropdownItemText,
                          selectedMonth === month && styles.monthDropdownItemTextActive
                        ]}>
                          {month}
                        </Text>
                        {selectedMonth === month && <Feather name="check" size={16} color="#10B981" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Clear Filters Button */}
        {(activeFilters.length > 0 || selectedMonth) && (
          <View style={styles.clearFiltersContainer}>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}
              activeOpacity={0.7}
            >
              <Feather name="x-circle" size={16} color="#EF4444" />
              <Text style={styles.clearFiltersText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <View style={styles.resultsCount}>
            <Text style={styles.countText}>
              {loading ? 'Loading...' : `${filteredWorkouts.length} Result${filteredWorkouts.length !== 1 ? 's' : ''}`}
            </Text>
            {searchText.length > 0 && <Badge>Filtered</Badge>}
          </View>
        </View>

        {/* Search Results */}
        {filteredWorkouts.length > 0 ? (
          <View style={styles.workoutList}>
            {filteredWorkouts.map((workout) => {
              const isExpanded = expandedWorkouts[workout.id];
              return (
                <Card key={workout.id}>
                  <CardContent>
                    <View style={styles.workoutItem}>
                      <View style={styles.workoutIconContainer}>
                        <Text style={styles.workoutIcon}>{workout.icon}</Text>
                      </View>
                      <View style={styles.workoutDetails}>
                        <Text style={styles.workoutName}>{workout.name}</Text>
                        <View style={styles.workoutMeta}>
                          <Badge>{workout.category}</Badge>
                          <Text style={styles.metaText}>•</Text>
                          <Text style={styles.metaText}>{workout.time}</Text>
                          <Text style={styles.metaText}>•</Text>
                          <Text style={styles.metaText}>{workout.date}</Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.durationText}>{workout.duration}</Text>
                      </View>
                    </View>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <View style={styles.expandedDetails}>
                        <View style={styles.detailRow}>
                          <Feather name="activity" size={16} color="#6B7280" />
                          <Text style={styles.detailLabel}>Intensity:</Text>
                          <Badge>{workout.intensity}</Badge>
                        </View>
                        {workout.notes && (
                          <View style={styles.detailRow}>
                            <Feather name="file-text" size={16} color="#6B7280" />
                            <Text style={styles.detailLabel}>Notes:</Text>
                            <Text style={styles.detailValue}>{workout.notes}</Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* View More Button */}
                    <TouchableOpacity 
                      style={styles.viewMoreButton}
                      onPress={() => toggleWorkoutDetails(workout.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.viewMoreText}>
                        {isExpanded ? 'View Less' : 'View More'}
                      </Text>
                      <Feather 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={16} 
                        color="#3B82F6" 
                      />
                    </TouchableOpacity>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card>
            <CardContent>
              <View style={styles.emptyState}>
                <Feather name="search" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>
                  {searchText ? 'No workouts found' : 'No workouts yet'}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchText ? 'Try a different search term' : 'Start adding workouts to see them here'}
                </Text>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Total Summary */}
        {filteredWorkouts.length > 0 && (
          <Card style={styles.summaryCard}>
            <CardContent>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Time</Text>
                <Text style={styles.summaryValue}>{totalDuration} min</Text>
              </View>
              <Text style={styles.summarySubtext}>
                {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
                {searchText && ' matching search'}
              </Text>
            </CardContent>
          </Card>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  contentContainer: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 24,
    gap: 24, // space-y-6
  },
  
  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 12, // rounded-xl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    padding: 16, // p-4
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6', // bg-gray-100
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search Bar
  searchBarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    zIndex: 1,
    padding: 2,
  },

  // Filters Section
  filtersSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Month Selector
  monthSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  monthScrollContent: {
    paddingRight: 16,
    gap: 8,
  },
  monthChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
  },
  monthChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  monthChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  monthChipTextActive: {
    color: '#FFFFFF',
  },

  // Month Dropdown
  monthDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
  },
  monthDropdownButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  monthDropdownList: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  monthDropdownItemText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  monthDropdownItemTextActive: {
    fontWeight: '600',
    color: '#10B981',
  },

  // Clear Filters
  clearFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },

  // Quick Filters
  quickFilterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  filterPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activePill: {
    backgroundColor: '#4F46E5', // bg-indigo-600
  },
  activePillText: {
    color: 'white',
  },
  inactivePill: {
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  inactivePillText: {
    color: '#4B5563', // text-gray-600
  },

  // Results Header
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resultsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#E5E7EB', // secondary badge bg
  },
  badgeText: {
    fontSize: 12,
    color: '#4B5563', // text-gray-600
    fontWeight: '500',
  },
  sortButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Workout Results
  workoutList: {
    gap: 12, // space-y-3
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  workoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DBEAFE', // bg-blue-100
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutIcon: {
    fontSize: 20, // text-xl for emoji
  },
  workoutDetails: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  // Expanded Details
  expandedDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  // View More Button
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },

  // Total Summary
  summaryCard: {
    backgroundColor: '#F3F4F6', // bg-gray-100
    borderWidth: 0,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },

  // Fixed Header Container
  fixedHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 48,
  },

  // Search Bar Wrapper (outside ScrollView)
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
});