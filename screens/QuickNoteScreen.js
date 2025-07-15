import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, Surface, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function QuickNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const [category, setCategory] = useState('other');
  
  const { addNote } = useAppContext();

  const saveNote = () => {
    if (!content.trim()) {
      Alert.alert('提示', '请输入笔记内容');
      return;
    }
    
    try {
      addNote(title.trim(), content.trim(), category);
      Alert.alert('保存成功', '笔记已保存到输入箱', [
        { 
          text: '确定', 
          onPress: () => {
            setTitle('');
            setContent('');
            setCategory('other');
          }
        }
      ]);
    } catch (error) {
      Alert.alert('保存失败', '请重试');
    }
  };

  const ToolbarButton = ({ icon, onPress, label }) => (
    <TouchableOpacity style={styles.toolbarButton} onPress={onPress}>
      <MaterialIcons name={icon} size={20} color="#666" />
      <Text style={styles.toolbarButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 页面标题 */}
        <View style={styles.header}>
          <MaterialIcons name="add-circle" size={24} color="#2f3437" />
          <Text style={styles.headerTitle}>速记</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 标题输入 */}
          <TextInput
            style={styles.titleInput}
            placeholder="无标题"
            placeholderTextColor="#9aa0a6"
            value={title}
            onChangeText={setTitle}
            multiline={false}
          />

          {/* 分类选择器 */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>分类：</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {[
                { key: 'work', label: '工作', icon: 'domain', color: '#1976d2' },
                { key: 'idea', label: '灵感', icon: 'lightbulb', color: '#f57c00' },
                { key: 'study', label: '学习', icon: 'school', color: '#388e3c' },
                { key: 'life', label: '生活', icon: 'home', color: '#e91e63' },
                { key: 'other', label: '其他', icon: 'more-horiz', color: '#666' },
              ].map(cat => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryChip,
                    category === cat.key && { backgroundColor: cat.color + '20', borderColor: cat.color }
                  ]}
                  onPress={() => setCategory(cat.key)}
                >
                  <MaterialIcons name={cat.icon} size={16} color={cat.color} />
                  <Text style={[
                    styles.categoryChipText,
                    category === cat.key && { color: cat.color, fontWeight: '600' }
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 工具栏 */}
          {showToolbar && (
            <Surface style={styles.toolbar}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.toolbarContent}
              >
                <ToolbarButton icon="format-bold" label="加粗" />
                <ToolbarButton icon="format-italic" label="斜体" />
                <ToolbarButton icon="format-underlined" label="下划线" />
                <ToolbarButton icon="format-list-bulleted" label="列表" />
                <ToolbarButton icon="format-list-numbered" label="数字" />
                <ToolbarButton icon="format-quote" label="引用" />
                <ToolbarButton icon="code" label="代码" />
              </ScrollView>
            </Surface>
          )}

          {/* 内容编辑器 */}
          <TextInput
            style={styles.contentInput}
            placeholder="开始输入..."
            placeholderTextColor="#9aa0a6"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            onFocus={() => setShowToolbar(true)}
            onBlur={() => setShowToolbar(false)}
          />

          {/* 底部间距 */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* 保存按钮 */}
        <FAB
          style={styles.fab}
          icon="check"
          onPress={saveNote}
          mode="elevated"
        />
      </KeyboardAvoidingView>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleInput: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2f3437',
    marginTop: 24,
    marginBottom: 16,
    padding: 0,
    lineHeight: 40,
  },
  contentInput: {
    fontSize: 16,
    color: '#2f3437',
    lineHeight: 24,
    minHeight: 300,
    padding: 0,
  },
  toolbar: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  toolbarContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  toolbarButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  categoryList: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 100,
  },
}); 