import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  List,
  Switch,
  Divider,
  Portal,
  Modal,
  RadioButton,
} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    openai: {
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      enabled: true,
    },
    anthropic: {
      apiKey: '',
      baseUrl: 'https://api.anthropic.com',
      enabled: false,
    },
    google: {
      apiKey: '',
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      enabled: false,
    },
    custom: {
      apiKey: '',
      baseUrl: '',
      enabled: false,
    },
  });

  const [expandedSection, setExpandedSection] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('light');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await SecureStore.getItemAsync('aiSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      const savedTheme = await SecureStore.getItemAsync('theme');
      if (savedTheme) {
        setSelectedTheme(savedTheme);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      await SecureStore.setItemAsync('aiSettings', JSON.stringify(settings));
      await SecureStore.setItemAsync('theme', selectedTheme);
      Alert.alert('成功', '设置已保存');
    } catch (error) {
      console.error('保存设置失败:', error);
      Alert.alert('错误', '保存设置失败');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (provider, key, value) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [key]: value,
      },
    }));
  };

  const testConnection = async (provider) => {
    Alert.alert(
      '连接测试',
      `${provider.toUpperCase()} 连接测试功能暂未实现`,
      [{ text: '确定' }]
    );
  };

  const resetSettings = () => {
    Alert.alert(
      '重置设置',
      '确定要重置所有设置吗？这将清除所有API密钥和配置。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => {
            setSettings({
              openai: {
                apiKey: '',
                baseUrl: 'https://api.openai.com/v1',
                enabled: true,
              },
              anthropic: {
                apiKey: '',
                baseUrl: 'https://api.anthropic.com',
                enabled: false,
              },
              google: {
                apiKey: '',
                baseUrl: 'https://generativelanguage.googleapis.com/v1',
                enabled: false,
              },
              custom: {
                apiKey: '',
                baseUrl: '',
                enabled: false,
              },
            });
            setSelectedTheme('light');
          },
        },
      ]
    );
  };

  const renderProviderSettings = (provider, title, description) => (
    <Card style={styles.providerCard} key={provider}>
      <List.Accordion
        title={title}
        description={description}
        expanded={expandedSection === provider}
        onPress={() => setExpandedSection(expandedSection === provider ? '' : provider)}
        left={(props) => <List.Icon {...props} icon="api" />}
        right={(props) => (
          <Switch
            value={settings[provider].enabled}
            onValueChange={(value) => updateSetting(provider, 'enabled', value)}
          />
        )}
      >
        <View style={styles.providerContent}>
          <TextInput
            label="API 密钥"
            value={settings[provider].apiKey}
            onChangeText={(text) => updateSetting(provider, 'apiKey', text)}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="基础 URL"
            value={settings[provider].baseUrl}
            onChangeText={(text) => updateSetting(provider, 'baseUrl', text)}
            style={styles.input}
            mode="outlined"
          />
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={() => testConnection(provider)}
              style={styles.testButton}
            >
              测试连接
            </Button>
          </View>
        </View>
      </List.Accordion>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* AI 模型配置 */}
        <Text style={styles.sectionTitle}>AI 模型配置</Text>
        
        {renderProviderSettings('openai', 'OpenAI', 'GPT-3.5, GPT-4 等模型')}
        {renderProviderSettings('anthropic', 'Anthropic', 'Claude 系列模型')}
        {renderProviderSettings('google', 'Google', 'Gemini 系列模型')}
        {renderProviderSettings('custom', '自定义', '自定义 API 端点')}

        <Divider style={styles.divider} />

        {/* 应用设置 */}
        <Text style={styles.sectionTitle}>应用设置</Text>
        
        <Card style={styles.settingCard}>
          <List.Item
            title="主题"
            description={selectedTheme === 'light' ? '浅色' : '深色'}
            left={(props) => <List.Icon {...props} icon="palette" />}
            right={(props) => (
              <Button
                mode="outlined"
                onPress={() => setThemeModalVisible(true)}
              >
                选择
              </Button>
            )}
          />
        </Card>

        <Card style={styles.settingCard}>
          <List.Item
            title="清除聊天记录"
            description="删除所有聊天历史"
            left={(props) => <List.Icon {...props} icon="delete" />}
            right={(props) => (
              <Button
                mode="outlined"
                onPress={() => Alert.alert('功能开发中', '此功能正在开发中')}
              >
                清除
              </Button>
            )}
          />
        </Card>

        <Divider style={styles.divider} />

        {/* 操作按钮 */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={saveSettings}
            loading={isLoading}
            style={styles.saveButton}
          >
            保存设置
          </Button>
          
          <Button
            mode="outlined"
            onPress={resetSettings}
            style={styles.resetButton}
          >
            重置设置
          </Button>
        </View>

        {/* 关于信息 */}
        <Divider style={styles.divider} />
        <Text style={styles.sectionTitle}>关于</Text>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Text style={styles.aboutText}>
              AI 聊天助手 v1.0.0{'\n'}
              支持多种AI模型的聊天应用{'\n'}
              包含文件上传和自定义配置功能
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* 主题选择模态框 */}
      <Portal>
        <Modal
          visible={themeModalVisible}
          onDismiss={() => setThemeModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>选择主题</Text>
          <RadioButton.Group
            onValueChange={(value) => setSelectedTheme(value)}
            value={selectedTheme}
          >
            <RadioButton.Item label="浅色主题" value="light" />
            <RadioButton.Item label="深色主题" value="dark" />
          </RadioButton.Group>
          <Button
            mode="text"
            onPress={() => setThemeModalVisible(false)}
            style={styles.modalCloseButton}
          >
            关闭
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
    color: '#333',
  },
  providerCard: {
    marginBottom: 8,
    elevation: 2,
  },
  providerContent: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  testButton: {
    marginTop: 8,
  },
  settingCard: {
    marginBottom: 8,
    elevation: 2,
  },
  divider: {
    marginVertical: 24,
  },
  actionButtons: {
    marginTop: 16,
  },
  saveButton: {
    marginBottom: 12,
  },
  resetButton: {
    marginBottom: 12,
  },
  aboutCard: {
    marginBottom: 24,
    elevation: 2,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 16,
  },
});

export default SettingsScreen; 