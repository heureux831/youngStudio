import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Chip,
  FAB,
  Portal,
  Modal,
  List,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [modelModalVisible, setModelModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const models = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedModel = await SecureStore.getItemAsync('selectedModel');
      if (savedModel) {
        setSelectedModel(savedModel);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  };

  const saveSelectedModel = async (modelId) => {
    try {
      await SecureStore.setItemAsync('selectedModel', modelId);
      setSelectedModel(modelId);
    } catch (error) {
      console.error('保存模型选择失败:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() && attachedFiles.length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      files: attachedFiles,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setAttachedFiles([]);
    setIsLoading(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: `这是来自${models.find(m => m.id === selectedModel)?.name}的回复。你说了: "${inputText}"`,
        sender: 'ai',
        timestamp: new Date(),
        model: selectedModel,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setAttachedFiles(prev => [...prev, {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.mimeType,
          uri: file.uri,
        }]);
      }
    } catch (error) {
      Alert.alert('错误', '选择文件失败');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        setAttachedFiles(prev => [...prev, {
          id: Date.now().toString(),
          name: `image_${Date.now()}.jpg`,
          size: image.fileSize,
          type: 'image/jpeg',
          uri: image.uri,
        }]);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片失败');
    }
  };

  const removeFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <Card style={[
        styles.messageCard,
        item.sender === 'user' ? styles.userCard : styles.aiCard
      ]}>
        <Card.Content>
          <Text style={[
            styles.messageText,
            item.sender === 'user' ? styles.userText : styles.aiText
          ]}>
            {item.text}
          </Text>
          {item.files && item.files.length > 0 && (
            <View style={styles.filesContainer}>
              {item.files.map(file => (
                <Chip key={file.id} style={styles.fileChip}>
                  {file.name}
                </Chip>
              ))}
            </View>
          )}
          <Text style={styles.timestamp}>
            {item.timestamp.toLocaleTimeString()}
            {item.model && ` • ${models.find(m => m.id === item.model)?.name}`}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 模型选择栏 */}
      <View style={styles.modelSelector}>
        <Button
          mode="outlined"
          onPress={() => setModelModalVisible(true)}
          icon="robot"
          style={styles.modelButton}
        >
          {models.find(m => m.id === selectedModel)?.name}
        </Button>
      </View>

      {/* 消息列表 */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* 附件预览 */}
      {attachedFiles.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <Text style={styles.attachmentsTitle}>附件:</Text>
          <FlatList
            data={attachedFiles}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.attachmentItem}>
                <Chip
                  onClose={() => removeFile(item.id)}
                  style={styles.attachmentChip}
                >
                  {item.name}
                </Chip>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}

      {/* 输入区域 */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="输入消息..."
            multiline
            mode="outlined"
          />
          <IconButton
            icon="paperclip"
            size={24}
            onPress={pickDocument}
            style={styles.attachButton}
          />
          <IconButton
            icon="image"
            size={24}
            onPress={pickImage}
            style={styles.attachButton}
          />
          <Button
            mode="contained"
            onPress={sendMessage}
            loading={isLoading}
            disabled={!inputText.trim() && attachedFiles.length === 0}
            style={styles.sendButton}
          >
            发送
          </Button>
        </View>
      </View>

      {/* 模型选择模态框 */}
      <Portal>
        <Modal
          visible={modelModalVisible}
          onDismiss={() => setModelModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>选择模型</Text>
          {models.map(model => (
            <List.Item
              key={model.id}
              title={model.name}
              description={model.provider}
              left={() => (
                <List.Icon
                  icon={selectedModel === model.id ? 'radiobox-marked' : 'radiobox-blank'}
                />
              )}
              onPress={() => {
                saveSelectedModel(model.id);
                setModelModalVisible(false);
              }}
            />
          ))}
          <Button
            mode="text"
            onPress={() => setModelModalVisible(false)}
            style={styles.modalCloseButton}
          >
            关闭
          </Button>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modelSelector: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modelButton: {
    borderRadius: 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    elevation: 2,
  },
  userCard: {
    backgroundColor: '#2196F3',
  },
  aiCard: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  filesContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fileChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  attachmentsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  attachmentItem: {
    marginRight: 8,
  },
  attachmentChip: {
    backgroundColor: '#e3f2fd',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
  attachButton: {
    margin: 0,
  },
  sendButton: {
    marginLeft: 8,
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

export default ChatScreen; 