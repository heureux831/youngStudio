import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: '会议记录',
      content: '今天的产品会议讨论了新功能的开发计划...',
      date: '2024-01-15',
      category: 'work',
      isRead: false,
    },
    {
      id: '2',
      title: '灵感碎片',
      content: '关于应用设计的新想法，可以参考Notion的...',
      date: '2024-01-14',
      category: 'idea',
      isRead: true,
    },
    {
      id: '3',
      title: '学习笔记',
      content: 'React Navigation的底部导航栏实现方法...',
      date: '2024-01-13',
      category: 'study',
      isRead: false,
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: '1',
      title: '个人项目',
      icon: 'person',
      color: '#1976d2',
      items: [
        { 
          id: '1-1', 
          title: '学习React Native', 
          startDate: '2024-01-15',
          endDate: '2024-03-15',
          document: '这是一个学习React Native的项目，目标是掌握移动端开发技能...'
        },
        { 
          id: '1-2', 
          title: '完成毕业设计', 
          startDate: '2024-02-01',
          endDate: '2024-06-01',
          document: '毕业设计项目，主要研究内容是...'
        },
        { 
          id: '1-3', 
          title: '准备面试', 
          startDate: '2024-04-01',
          endDate: '2024-05-15',
          document: '面试准备计划和相关资料整理...'
        },
      ],
      expanded: true,
    },
    {
      id: '2',
      title: '工作项目',
      icon: 'domain',
      color: '#f57c00',
      items: [
        { 
          id: '2-1', 
          title: '移动应用开发', 
          startDate: '2024-01-20',
          endDate: '2024-04-20',
          document: '公司移动应用项目开发文档...'
        },
        { 
          id: '2-2', 
          title: '系统重构', 
          startDate: '2024-03-01',
          endDate: '2024-07-01',
          document: '现有系统重构方案和实施计划...'
        },
      ],
      expanded: false,
    },
    {
      id: '3',
      title: '兴趣项目',
      icon: 'lightbulb',
      color: '#388e3c',
      items: [
        { 
          id: '3-1', 
          title: '个人博客搭建', 
          startDate: '2024-02-10',
          endDate: '2024-03-10',
          document: '搭建个人技术博客的计划和实施方案...'
        },
        { 
          id: '3-2', 
          title: '开源项目贡献', 
          startDate: '2024-03-15',
          endDate: '2024-12-31',
          document: '参与开源项目的计划和贡献记录...'
        },
      ],
      expanded: true,
    },
  ]);

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSync: true,
    biometric: false,
  });

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 保存数据
  useEffect(() => {
    saveData();
  }, [notes, projects, settings]);

  const loadData = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const storedProjects = await AsyncStorage.getItem('projects');
      const storedSettings = await AsyncStorage.getItem('settings');

      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      await AsyncStorage.setItem('projects', JSON.stringify(projects));
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

  // 笔记相关操作
  const addNote = (title, content, category = 'other') => {
    const newNote = {
      id: Date.now().toString(),
      title: title || '无标题',
      content,
      date: new Date().toISOString().split('T')[0],
      category,
      isRead: false,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (noteId, updates) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...updates } : note
    ));
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const markNoteAsRead = (noteId) => {
    updateNote(noteId, { isRead: true });
  };

  // 项目相关操作
  const addProject = (title, icon = 'folder', color = '#666') => {
    const newProject = {
      id: Date.now().toString(),
      title,
      icon,
      color,
      items: [],
      expanded: true,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const toggleProject = (projectId) => {
    updateProject(projectId, { 
      expanded: !projects.find(p => p.id === projectId)?.expanded 
    });
  };

  const addProjectItem = (projectId, title, startDate = '', endDate = '') => {
    const newItem = {
      id: Date.now().toString(),
      title,
      startDate,
      endDate,
      document: '',
    };
    
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, items: [...project.items, newItem] }
        : project
    ));
    return newItem;
  };

  const updateProjectItem = (projectId, itemId, updates) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId
        ? {
            ...project,
            items: project.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : project
    ));
  };

  // 设置相关操作
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // 统计数据
  const getStats = () => {
    const totalNotes = notes.length;
    const unreadNotes = notes.filter(note => !note.isRead).length;
    const totalProjects = projects.length;
    const totalSubProjects = projects.reduce((sum, project) => sum + project.items.length, 0);

    return {
      totalNotes,
      unreadNotes,
      totalProjects,
      totalSubProjects,
    };
  };

  const value = {
    // 数据
    notes,
    projects,
    settings,
    
    // 笔记操作
    addNote,
    updateNote,
    deleteNote,
    markNoteAsRead,
    
    // 项目操作
    addProject,
    updateProject,
    deleteProject,
    toggleProject,
    addProjectItem,
    updateProjectItem,
    
    // 设置操作
    updateSetting,
    
    // 统计
    getStats,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 