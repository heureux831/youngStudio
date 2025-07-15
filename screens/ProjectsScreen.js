import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Text, Surface, FAB, TextInput, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function ProjectsScreen({ navigation }) {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  const { 
    projects, 
    addProject, 
    toggleProject,
    updateProject,
    addProjectItem
  } = useAppContext();

  const handleToggleProject = (projectId) => {
    toggleProject(projectId);
  };

  const handleAddProject = () => {
    if (newProjectTitle.trim()) {
      addProject(newProjectTitle.trim());
      setNewProjectTitle('');
      setShowNewProjectModal(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setNewProjectTitle(project.title);
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = () => {
    if (newProjectTitle.trim() && editingProject) {
      updateProject(editingProject.id, { title: newProjectTitle.trim() });
      setNewProjectTitle('');
      setEditingProject(null);
      setShowEditProjectModal(false);
    }
  };

  const handleAddItem = (projectId) => {
    setSelectedProjectId(projectId);
    setShowAddItemModal(true);
  };

  const handleAddProjectItem = () => {
    if (newItemTitle.trim() && selectedProjectId) {
      addProjectItem(selectedProjectId, newItemTitle.trim());
      setNewItemTitle('');
      setSelectedProjectId(null);
      setShowAddItemModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}`;
  };

  const getProjectProgress = (items) => {
    if (!items || items.length === 0) return '';
    
    const now = new Date();
    const activeItems = items.filter(item => {
      if (!item.startDate || !item.endDate) return false;
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      return now >= start && now <= end;
    });
    
    return activeItems.length > 0 ? `${activeItems.length} 个进行中` : `${items.length} 个项目`;
  };

  const renderProjectItem = ({ item: project }) => (
    <Surface style={styles.projectCard}>
      {/* 项目标题 */}
      <TouchableOpacity
        style={styles.projectHeader}
        onPress={() => handleToggleProject(project.id)}
      >
        <View style={styles.projectTitleRow}>
          <View style={[styles.projectIcon, { backgroundColor: project.color }]}>
            <MaterialIcons name={project.icon} size={20} color="#ffffff" />
          </View>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditProject(project)}
          >
            <MaterialIcons name="edit" size={16} color="#666" />
          </TouchableOpacity>
          <View style={styles.projectStats}>
            <Text style={styles.statsText}>
              {getProjectProgress(project.items)}
            </Text>
          </View>
        </View>
        <MaterialIcons 
          name={project.expanded ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} 
          size={24} 
          color="#666" 
        />
      </TouchableOpacity>

      {/* 项目子项 */}
      {project.expanded && (
        <View style={styles.projectItems}>
          {project.items.map(item => (
            <View key={item.id} style={styles.projectItem}>
              <View style={styles.itemIcon}>
                <MaterialIcons name="assignment" size={16} color="#666" />
              </View>
              
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>
                  {item.title}
                </Text>
                
                <View style={styles.itemMeta}>
                  {(item.startDate || item.endDate) && (
                    <View style={styles.dateRange}>
                      <MaterialIcons name="schedule" size={12} color="#999" />
                      <Text style={styles.dateText}>
                        {item.startDate && formatDate(item.startDate)}
                        {item.startDate && item.endDate && ' - '}
                        {item.endDate && formatDate(item.endDate)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.itemDetailButton}
                onPress={() => navigation.navigate('ProjectItemDetail', {
                  projectId: project.id,
                  itemId: item.id
                })}
              >
                <MaterialIcons name="chevron-right" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
          
          {/* 添加新项按钮 */}
          <TouchableOpacity 
            style={styles.addItemButton}
            onPress={() => handleAddItem(project.id)}
          >
            <MaterialIcons name="add-circle" size={16} color="#666" />
            <Text style={styles.addItemText}>添加子项目</Text>
          </TouchableOpacity>
        </View>
      )}
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 页面标题 */}
      <View style={styles.header}>
        <MaterialIcons name="folder" size={24} color="#2f3437" />
        <Text style={styles.headerTitle}>项目</Text>
        <View style={styles.headerRight}>
          <Text style={styles.totalProjects}>{projects.length}</Text>
        </View>
      </View>

      {/* 项目列表 */}
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
        style={styles.projectsList}
        contentContainerStyle={styles.projectsContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="folder-open" size={64} color="#e0e0e0" />
            <Text style={styles.emptyText}>暂无项目</Text>
            <Text style={styles.emptySubtext}>创建第一个项目开始管理您的工作和学习</Text>
          </View>
        )}
      />

      {/* 添加项目按钮 */}
              <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setShowNewProjectModal(true)}
          mode="elevated"
        />

      {/* 新建项目模态框 */}
      <Modal
        visible={showNewProjectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNewProjectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent}>
            <Text style={styles.modalTitle}>新建项目</Text>
            
            <TextInput
              mode="outlined"
              label="项目名称"
              value={newProjectTitle}
              onChangeText={setNewProjectTitle}
              style={styles.modalInput}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowNewProjectModal(false)}
                style={styles.modalButton}
              >
                取消
              </Button>
              <Button
                mode="contained"
                onPress={handleAddProject}
                style={styles.modalButton}
                disabled={!newProjectTitle.trim()}
              >
                创建
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>

      {/* 编辑项目模态框 */}
      <Modal
        visible={showEditProjectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditProjectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent}>
            <Text style={styles.modalTitle}>编辑项目</Text>
            
            <TextInput
              mode="outlined"
              label="项目名称"
              value={newProjectTitle}
              onChangeText={setNewProjectTitle}
              style={styles.modalInput}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowEditProjectModal(false);
                  setEditingProject(null);
                  setNewProjectTitle('');
                }}
                style={styles.modalButton}
              >
                取消
              </Button>
              <Button
                mode="contained"
                onPress={handleUpdateProject}
                style={styles.modalButton}
                disabled={!newProjectTitle.trim()}
              >
                保存
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>

      {/* 添加子项目模态框 */}
      <Modal
        visible={showAddItemModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddItemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加子项目</Text>
            
            <TextInput
              mode="outlined"
              label="子项目名称"
              value={newItemTitle}
              onChangeText={setNewItemTitle}
              style={styles.modalInput}
              autoFocus
              placeholder="例如：移动端开发、后端API设计..."
            />
            
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowAddItemModal(false);
                  setSelectedProjectId(null);
                  setNewItemTitle('');
                }}
                style={styles.modalButton}
              >
                取消
              </Button>
              <Button
                mode="contained"
                onPress={handleAddProjectItem}
                style={styles.modalButton}
                disabled={!newItemTitle.trim()}
              >
                添加
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
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
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  totalProjects: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  projectsList: {
    flex: 1,
  },
  projectsContent: {
    padding: 20,
    paddingBottom: 100,
  },
  projectCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f3437',
    flex: 1,
  },
  editButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
  },
  projectStats: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  projectItems: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 8,
    marginBottom: 4,
  },
  itemIcon: {
    padding: 4,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    color: '#2f3437',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#1976d2',
    marginLeft: 4,
    fontWeight: '500',
  },
  itemDetailButton: {
    padding: 8,
    marginLeft: 8,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 8,
    marginTop: 4,
  },
  addItemText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2f3437',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 