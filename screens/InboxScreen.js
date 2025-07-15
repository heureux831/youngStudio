import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Text, Surface, Searchbar, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function InboxScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  const { notes, markNoteAsRead } = useAppContext();

  const filters = [
    { key: 'all', label: '全部', icon: 'inbox' },
    { key: 'unread', label: '未读', icon: 'mail' },
    { key: 'work', label: '工作', icon: 'domain' },
    { key: 'idea', label: '灵感', icon: 'lightbulb' },
    { key: 'study', label: '学习', icon: 'school' },
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !note.isRead) ||
                         note.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: 实现刷新逻辑
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMarkAsRead = (noteId) => {
    markNoteAsRead(noteId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: '#1976d2',
      idea: '#f57c00',
      study: '#388e3c',
      life: '#e91e63',
      other: '#666',
    };
    return colors[category] || '#666';
  };

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.noteItem}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <Surface style={[styles.noteCard, !item.isRead && styles.unreadCard]}>
        <View style={styles.noteHeader}>
          <View style={styles.noteTitleRow}>
            <Text style={styles.noteTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.unreadIndicator} />}
          </View>
          <Text style={styles.noteDate}>{formatDate(item.date)}</Text>
        </View>
        
        <Text style={styles.noteContent} numberOfLines={2}>
          {item.content}
        </Text>
        
        <View style={styles.noteFooter}>
          <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(item.category) }]} />
          <Text style={styles.categoryText}>
            {filters.find(f => f.key === item.category)?.label || '其他'}
          </Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 页面标题 */}
      <View style={styles.header}>
        <MaterialIcons name="inbox" size={24} color="#2f3437" />
        <Text style={styles.headerTitle}>输入箱</Text>
        <View style={styles.headerRight}>
          <Text style={styles.unreadCount}>
            {notes.filter(n => !n.isRead).length}
          </Text>
        </View>
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="搜索笔记..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          iconColor="#666"
        />
      </View>

      {/* 筛选器 */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <Chip
              mode={selectedFilter === item.key ? 'flat' : 'outlined'}
              selected={selectedFilter === item.key}
              onPress={() => setSelectedFilter(item.key)}
              style={[
                styles.filterChip,
                selectedFilter === item.key && styles.selectedFilterChip
              ]}
              textStyle={[
                styles.filterChipText,
                selectedFilter === item.key && styles.selectedFilterChipText
              ]}
              icon={item.icon}
            >
              {item.label}
            </Chip>
          )}
        />
      </View>

      {/* 笔记列表 */}
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id}
        style={styles.notesList}
        contentContainerStyle={styles.notesContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#e0e0e0" />
            <Text style={styles.emptyText}>暂无笔记</Text>
            <Text style={styles.emptySubtext}>开始记录你的想法吧</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2f3437',
    marginLeft: 12,
    flex: 1,
  },
  headerRight: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchbar: {
    backgroundColor: '#f8f9fa',
    elevation: 0,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  filtersContainer: {
    paddingTop: 16,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderColor: '#e0e0e0',
  },
  selectedFilterChip: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
  },
  filterChipText: {
    color: '#666',
    fontSize: 12,
  },
  selectedFilterChipText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  notesList: {
    flex: 1,
    marginTop: 16,
  },
  notesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noteItem: {
    marginBottom: 12,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  unreadCard: {
    borderColor: '#1976d2',
    borderWidth: 1.5,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f3437',
    flex: 1,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1976d2',
    marginLeft: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
  },
  noteContent: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9aa0a6',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#c0c0c0',
    marginTop: 8,
  },
}); 