import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { 
  Text, 
  Surface, 
  TextInput, 
  Button, 
  IconButton,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function ProjectItemDetailScreen({ route, navigation }) {
  const { projectId, itemId } = route.params;
  const { projects, updateProjectItem } = useAppContext();
  
  const project = projects.find(p => p.id === projectId);
  const item = project?.items.find(i => i.id === itemId);
  
  const [title, setTitle] = useState(item?.title || '');
  const [startDate, setStartDate] = useState(item?.startDate || '');
  const [endDate, setEndDate] = useState(item?.endDate || '');
  const [document, setDocument] = useState(item?.document || '');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setStartDate(item.startDate || '');
      setEndDate(item.endDate || '');
      setDocument(item.document || '');
    }
  }, [item]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    const updates = {
      title: title.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      document: document.trim(),
    };
    
    updateProjectItem(projectId, itemId, updates);
    navigation.goBack();
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '同一天';
    if (diffDays < 30) return `${diffDays} 天`;
    if (diffDays < 365) {
      const months = Math.round(diffDays / 30);
      return `约 ${months} 个月`;
    }
    const years = Math.round(diffDays / 365);
    return `约 ${years} 年`;
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>项目不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>项目详情</Text>
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={!title.trim()}
        >
          保存
        </Button>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          {/* 基本信息 */}
          <Surface style={styles.section}>
            <Text style={styles.sectionTitle}>基本信息</Text>
            
            {/* 项目标题 */}
            <TextInput
              mode="outlined"
              label="项目标题"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            {/* 所属项目显示 */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>所属项目:</Text>
              <View style={styles.projectInfo}>
                <View style={[styles.projectIcon, { backgroundColor: project.color }]}>
                  <MaterialIcons name={project.icon} size={16} color="#ffffff" />
                </View>
                <Text style={styles.infoValue}>{project.title}</Text>
              </View>
            </View>
          </Surface>

          {/* 时间配置 */}
          <Surface style={styles.section}>
            <Text style={styles.sectionTitle}>时间配置</Text>
            
            {/* 开始时间 */}
            <TextInput
              mode="outlined"
              label="开始时间"
              value={startDate}
              onChangeText={setStartDate}
              style={styles.input}
              placeholder="例如: 2024-01-15"
              left={<TextInput.Icon icon="calendar-start" />}
            />

            {/* 结束时间 */}
            <TextInput
              mode="outlined"
              label="结束时间"
              value={endDate}
              onChangeText={setEndDate}
              style={styles.input}
              placeholder="例如: 2024-03-15"
              left={<TextInput.Icon icon="calendar-end" />}
            />

            {/* 项目时长显示 */}
            {(startDate && endDate) && (
              <View style={styles.durationContainer}>
                <MaterialIcons name="schedule" size={16} color="#666" />
                <Text style={styles.durationText}>
                  项目时长: {calculateDuration()}
                </Text>
              </View>
            )}
          </Surface>

          {/* 项目文档 */}
          <Surface style={styles.documentSection}>
            <Text style={styles.sectionTitle}>项目文档</Text>
            <Text style={styles.documentHint}>
              在这里记录项目的详细信息、计划、进展、想法等...
            </Text>
            <TextInput
              mode="outlined"
              label="项目文档"
              value={document}
              onChangeText={setDocument}
              style={styles.documentInput}
              multiline
              numberOfLines={12}
              placeholder="记录项目的详细信息、计划、进展、想法、遇到的问题、解决方案等..."
            />
          </Surface>

          {/* 底部间距 */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f3437',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  documentSection: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f3437',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#2f3437',
    fontWeight: '500',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#1976d2',
    marginLeft: 6,
    fontWeight: '500',
  },
  documentHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  documentInput: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  bottomSpacing: {
    height: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});