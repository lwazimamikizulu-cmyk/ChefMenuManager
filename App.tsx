
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';

type Course = 'Starter' | 'Main Course' | 'Dessert';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number;
};

const courses: Course[] = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState<Course>('Main Course');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Clear the input form
  const clearForm = () => {
    setDishName('');
    setDescription('');
    setPrice('');
    setCourse('Main Course');
    setEditingId(null);
  };

  // Add or update a menu item
  const saveMenuItem = () => {
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Missing information', 'Please complete all required fields.');
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price greater than zero.');
      return;
    }

    if (editingId) {
      setMenuItems(previous =>
        previous.map(item =>
          item.id === editingId
            ? {
                ...item,
                name: dishName.trim(),
                description: description.trim(),
                course,
                price: numericPrice,
              }
            : item
        )
      );

      Alert.alert('Success', 'Menu item updated successfully!');
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: dishName.trim(),
        description: description.trim(),
        course,
        price: numericPrice,
      };

      setMenuItems(previous => [...previous, newItem]);

      Alert.alert('Success', 'Menu item added successfully!');
    }

    clearForm();
  };

  // Edit an existing menu item
  const editMenuItem = (item: MenuItem) => {
    setDishName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setCourse(item.course);
    setEditingId(item.id);
  };

  // Delete a menu item
  const deleteMenuItem = (id: string) => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(previous =>
              previous.filter(item => item.id !== id)
            );

            if (editingId === id) {
              clearForm();
            }

            Alert.alert('Deleted', 'Menu item removed successfully.');
          },
        },
      ]
    );
  };

  // Search and filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' || item.course === filter;

    return matchesSearch && matchesFilter;
  });

  // Calculate menu statistics
  const totalItems = menuItems.length;

  const averagePrice =
    totalItems > 0
      ? menuItems.reduce((total, item) => total + item.price, 0) /
        totalItems
      : 0;

  const courseCount = (selectedCourse: Course) =>
    menuItems.filter(item => item.course === selectedCourse).length;

  // Display each menu item
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      <View style={styles.menuHeader}>
        <View style={styles.menuDetails}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.courseLabel}>{item.course}</Text>
        </View>

        <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
      </View>

      <Text style={styles.descriptionText}>{item.description}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editMenuItem(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteMenuItem(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Application Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>CHRISTOFFEL'S RESTAURANT</Text>
          <Text style={styles.headerTitle}>Chef's Menu Manager</Text>
          <Text style={styles.headerDescription}>
            Manage your restaurant menu with ease.
          </Text>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Overview</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalItems}</Text>
              <Text style={styles.statLabel}>Total Dishes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                R{averagePrice.toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Average Price</Text>
            </View>
          </View>

          <View style={styles.courseStats}>
            {courses.map(item => (
              <View key={item} style={styles.courseStat}>
                <Text style={styles.courseStatNumber}>
                  {courseCount(item)}
                </Text>
                <Text style={styles.courseStatLabel}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Add or Edit Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {editingId ? 'Edit Menu Item' : 'Add New Dish'}
          </Text>

          <Text style={styles.label}>Dish Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            value={dishName}
            onChangeText={setDishName}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Describe your dish"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Course *</Text>
          <View style={styles.courseOptions}>
            {courses.map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.courseButton,
                  course === item && styles.selectedCourse,
                ]}
                onPress={() => setCourse(item)}
              >
                <Text
                  style={[
                    styles.courseButtonText,
                    course === item && styles.selectedCourseText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Price (R) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveMenuItem}
          >
            <Text style={styles.saveButtonText}>
              {editingId ? 'Update Dish' : 'Add Menu Item'}
            </Text>
          </TouchableOpacity>

          {editingId && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={clearForm}
            >
              <Text style={styles.cancelButtonText}>Cancel Editing</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search and Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Find Menu Items</Text>

          <TextInput
            style={styles.input}
            placeholder="Search by dish name..."
            value={search}
            onChangeText={setSearch}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['All', ...courses].map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterButton,
                  filter === item && styles.activeFilter,
                ]}
                onPress={() => setFilter(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === item && styles.activeFilterText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearch('');
              setFilter('All');
            }}
          >
            <Text style={styles.clearButtonText}>Clear Search and Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Menu List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Menu</Text>

          {menuItems.length === 0 ? (
            <View style={styles.emptyMessage}>
              <Text style={styles.emptyTitle}>Your menu is empty</Text>
              <Text style={styles.emptyText}>
                No dishes have been added yet. Use the form above to add
                your first menu item.
              </Text>
            </View>
          ) : filteredItems.length === 0 ? (
            <View style={styles.emptyMessage}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                Try another search or clear your filters.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              renderItem={renderMenuItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        <Text style={styles.footer}>
          Chef's Menu Manager | Christoffel's Restaurant
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EF',
  },
  header: {
    backgroundColor: '#382C27',
    padding: 28,
    paddingTop: 55,
    paddingBottom: 32,
  },
  headerSubtitle: {
    color: '#D9BFA5',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 12,
  },
  headerDescription: {
    color: '#E5DAD0',
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    margin: 16,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#382C27',
    marginBottom: 17,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F3EAE1',
    padding: 17,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#75543F',
  },
  statLabel: {
    fontSize: 12,
    color: '#6C5C51',
    marginTop: 5,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  courseStat: {
    alignItems: 'center',
    flex: 1,
  },
  courseStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#75543F',
  },
  courseStatLabel: {
    fontSize: 11,
    color: '#6C5C51',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#382C27',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#DED5CC',
    borderRadius: 8,
    padding: 13,
    fontSize: 14,
    color: '#382C27',
  },
  descriptionInput: {
    height: 85,
    textAlignVertical: 'top',
  },
  courseOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  courseButton: {
    borderWidth: 1,
    borderColor: '#BCA996',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedCourse: {
    backgroundColor: '#75543F',
    borderColor: '#75543F',
  },
  courseButtonText: {
    color: '#75543F',
    fontSize: 12,
  },
  selectedCourseText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#75543F',
    padding: 15,
    borderRadius: 9,
    marginTop: 22,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#75543F',
    fontWeight: 'bold',
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#BCA996',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#75543F',
    borderColor: '#75543F',
  },
  filterText: {
    color: '#75543F',
    fontSize: 12,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  clearButton: {
    marginTop: 14,
    alignItems: 'center',
    padding: 8,
  },
  clearButtonText: {
    color: '#75543F',
    fontSize: 13,
    fontWeight: 'bold',
  },
  menuCard: {
    backgroundColor: '#FAF8F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7DED5',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuDetails: {
    flex: 1,
    marginRight: 8,
  },
  dishName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#382C27',
  },
  courseLabel: {
    color: '#92745B',
    fontSize: 12,
    marginTop: 4,
  },
  price: {
    color: '#75543F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  descriptionText: {
    color: '#6C5C51',
    fontSize: 13,
    marginTop: 12,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#75543F',
    padding: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#A64F45',
    padding: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyMessage: {
    backgroundColor: '#FAF8F5',
    padding: 22,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#75543F',
  },
  emptyText: {
    fontSize: 13,
    color: '#6C5C51',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    color: '#92745B',
    fontSize: 11,
    padding: 25,
  },
});
