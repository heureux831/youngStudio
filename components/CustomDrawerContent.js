import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Drawer,
  Avatar,
  Card,
  Button,
  List,
  Divider,
  Switch,
  Chip,
} from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store';

const CustomDrawerContent = (props) => {
  const [userInfo, setUserInfo] = useState({
    name: 'AI 用户',
    email: 'user@example.com',
    avatar: null,
  });
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [enabledProviders, setEnabledProviders] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const models = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  ];

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const savedModel = await SecureStore.getItemAsync('selectedModel');
      if (savedModel) {
        setSelectedModel(savedModel);
      }

      const savedSettings = await SecureStore.getItemAsync('aiSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const enabled = Object.keys(settings).filter(key => settings[key].enabled);
        setEnabledProviders(enabled);
      }

      const savedTheme = await SecureStore.getItemAsync('theme');
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('加载用户设置失败:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    try {
      await SecureStore.setItemAsync('theme', newTheme);
    } catch (error) {
      console.error('保存主题设置失败:', error);
    }
  };

  const quickModelChange = async (modelId) => {
    setSelectedModel(modelId);
    try {
      await SecureStore.setItemAsync('selectedModel', modelId);
    } catch (error) {
      console.error('保存模型选择失败:', error);
    }
  };

  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.drawerContent}>
        {/* 用户信息区域 */}
        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={64}
              label={userInfo.name.charAt(0)}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* 当前模型信息 */}
        <View style={styles.currentModelSection}>
          <Text style={styles.sectionTitle}>当前模型</Text>
          <Card style={styles.modelCard}>
            <Card.Content>
              <View style={styles.modelInfo}>
                <Text style={styles.modelName}>{currentModel?.name}</Text>
                <Chip mode="outlined" style={styles.providerChip}>
                  {currentModel?.provider}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* 快速模型切换 */}
        <View style={styles.quickModelSection}>
          <Text style={styles.sectionTitle}>快速切换</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.modelChipsContainer}
          >
            {models.map(model => (
              <Chip
                key={model.id}
                mode={selectedModel === model.id ? 'flat' : 'outlined'}
                selected={selectedModel === model.id}
                onPress={() => quickModelChange(model.id)}
                style={styles.modelChip}
              >
                {model.name}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <Divider style={styles.divider} />

        {/* 导航菜单 */}
        <View style={styles.menuSection}>
          <Drawer.Section title="菜单">
            <Drawer.Item
              icon="message"
              label="聊天"
              active={props.state.routeNames[props.state.index] === 'Chat'}
              onPress={() => props.navigation.navigate('Chat')}
            />
            <Drawer.Item
              icon="cog"
              label="设置"
              active={props.state.routeNames[props.state.index] === 'Settings'}
              onPress={() => props.navigation.navigate('Settings')}
            />
          </Drawer.Section>
        </View>

        <Divider style={styles.divider} />

        {/* 应用设置 */}
        <View style={styles.appSettingsSection}>
          <Text style={styles.sectionTitle}>应用设置</Text>
          
          <List.Item
            title="深色模式"
            description="切换应用主题"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={toggleTheme}
              />
            )}
          />

          <List.Item
            title="已启用服务"
            description={`${enabledProviders.length} 个服务商`}
            left={(props) => <List.Icon {...props} icon="check-circle" />}
            right={() => (
              <View style={styles.providerCount}>
                <Text style={styles.countText}>{enabledProviders.length}</Text>
              </View>
            )}
          />
        </View>

        <Divider style={styles.divider} />

        {/* 底部操作 */}
        <View style={styles.bottomSection}>
          <Button
            mode="outlined"
            onPress={() => props.navigation.navigate('Settings')}
            style={styles.actionButton}
            icon="cog"
          >
            管理设置
          </Button>
          
          <Button
            mode="text"
            onPress={() => {
              // 这里可以添加关于页面或帮助
              console.log('关于应用');
            }}
            style={styles.actionButton}
          >
            关于应用
          </Button>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#2196F3',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    marginVertical: 16,
  },
  currentModelSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  modelCard: {
    elevation: 2,
  },
  modelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  providerChip: {
    backgroundColor: '#e3f2fd',
  },
  quickModelSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modelChipsContainer: {
    flexDirection: 'row',
  },
  modelChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  appSettingsSection: {
    paddingHorizontal: 20,
  },
  providerCount: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 'auto',
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default CustomDrawerContent; 