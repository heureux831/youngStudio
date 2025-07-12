import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 导入组件
import MessageItem from './components/MessageItem';
import TypingIndicator from './components/TypingIndicator';
import ChatHeader from './components/ChatHeader';
import MessageInput from './components/MessageInput';
import SettingsModal from './components/SettingsModal';
import { markdownStyles } from './components/MarkdownStyles';

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '你好！我是AI助手，**DeepSeek**已经配置好了，我们可以开始聊天了！\n\n有什么可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date(),
      provider: 'deepseek',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const flatListRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;
  
  // 设置状态
  const [settings, setSettings] = useState({
    selectedProvider: 'deepseek',
    providers: {
      openai: {
        name: 'OpenAI',
        icon: '🤖',
        apiKey: '',
        baseUrl: 'https://api.openai.com/v1',
        models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
        selectedModel: 'gpt-3.5-turbo',
        enabled: false,
      },
      deepseek: {
        name: 'DeepSeek',
        icon: '🧠',
        apiKey: '',
        baseUrl: 'https://api.deepseek.com/v1',
        models: ['deepseek-chat', 'deepseek-reasoner'],
        selectedModel: 'deepseek-chat',
        enabled: true,
      },
      anthropic: {
        name: 'Anthropic',
        icon: '🎭',
        apiKey: '',
        baseUrl: 'https://api.anthropic.com',
        models: ['claude-3-sonnet', 'claude-3-haiku'],
        selectedModel: 'claude-3-sonnet',
        enabled: false,
      },
      google: {
        name: 'Google',
        icon: '🌟',
        apiKey: '',
        baseUrl: 'https://generativelanguage.googleapis.com/v1',
        models: ['gemini-pro', 'gemini-pro-vision'],
        selectedModel: 'gemini-pro',
        enabled: false,
      },
      custom: {
        name: '自定义',
        icon: '⚙️',
        apiKey: '',
        baseUrl: '',
        models: ['custom-model'],
        selectedModel: 'custom-model',
        enabled: false,
      },
    },
  });

  useEffect(() => {
    if (isLoading) {
      startTypingAnimation();
    } else {
      stopTypingAnimation();
    }
  }, [isLoading]);

  const startTypingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopTypingAnimation = () => {
    typingAnimation.stopAnimation();
    typingAnimation.setValue(0);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputText;
    setInputText('');
    setIsLoading(true);

    // 滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const currentProvider = settings.providers[settings.selectedProvider];
      
      if (!currentProvider.apiKey) {
        throw new Error(`请先配置${currentProvider.name}的API密钥`);
      }

      // 创建一个空的AI消息用于流式更新
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage = {
        id: aiMessageId,
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        isStreaming: true,
        provider: settings.selectedProvider,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessageId(aiMessageId);

      // 根据不同供应商调用流式API
      switch (settings.selectedProvider) {
        case 'deepseek':
          await callDeepSeekStreamAPI(currentProvider, currentMessage, aiMessageId);
          break;
        case 'openai':
          await callOpenAIStreamAPI(currentProvider, currentMessage, aiMessageId);
          break;
        default:
          // 对于不支持流式的API，使用普通调用
          await callNonStreamAPI(currentProvider, currentMessage, aiMessageId);
          break;
      }

    } catch (error) {
      console.error('API调用失败:', error);
      
      let errorMessage = '❌ 发生错误：';
      
      if (error.message.includes('网络')) {
        errorMessage += '网络连接失败，请检查网络设置';
      } else if (error.message.includes('401')) {
        errorMessage += 'API密钥无效，请检查配置';
      } else if (error.message.includes('429')) {
        errorMessage += 'API调用频率过高，请稍后重试';
      } else if (error.message.includes('500')) {
        errorMessage += '服务器错误，请稍后重试';
      } else {
        errorMessage += error.message;
      }
      
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date(),
        provider: settings.selectedProvider,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  // DeepSeek 流式API调用
  const callDeepSeekStreamAPI = async (provider, message, messageId) => {
    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.selectedModel,
          messages: [
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `DeepSeek API错误: ${response.status}`);
      }

      // React Native不支持ReadableStream的getReader，所以我们使用文本响应
      const textResponse = await response.text();
      const lines = textResponse.split('\n');
      let accumulatedText = '';
      
      // 模拟流式效果，逐行处理
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              accumulatedText += content;
              // 添加延迟以模拟流式效果
              await new Promise(resolve => setTimeout(resolve, 50));
              updateStreamingMessage(messageId, accumulatedText);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
      
      // 如果没有流式数据，尝试解析为普通响应
      if (!accumulatedText) {
        try {
          const jsonResponse = JSON.parse(textResponse);
          if (jsonResponse.choices?.[0]?.message?.content) {
            accumulatedText = jsonResponse.choices[0].message.content;
            updateStreamingMessage(messageId, accumulatedText);
          }
        } catch (e) {
          throw new Error('无法解析API响应');
        }
      }
      
    } catch (error) {
      // 如果流式调用失败，回退到普通API调用
      console.log('流式API调用失败，回退到普通调用:', error.message);
      const fallbackResponse = await callDeepSeekAPI(provider, message);
      updateStreamingMessage(messageId, fallbackResponse);
    } finally {
      // 标记流式传输完成
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
    }
  };

  // OpenAI 流式API调用
  const callOpenAIStreamAPI = async (provider, message, messageId) => {
    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.selectedModel,
          messages: [
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `OpenAI API错误: ${response.status}`);
      }

      // React Native不支持ReadableStream的getReader，所以我们使用文本响应
      const textResponse = await response.text();
      const lines = textResponse.split('\n');
      let accumulatedText = '';
      
      // 模拟流式效果，逐行处理
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              accumulatedText += content;
              // 添加延迟以模拟流式效果
              await new Promise(resolve => setTimeout(resolve, 50));
              updateStreamingMessage(messageId, accumulatedText);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
      
      // 如果没有流式数据，尝试解析为普通响应
      if (!accumulatedText) {
        try {
          const jsonResponse = JSON.parse(textResponse);
          if (jsonResponse.choices?.[0]?.message?.content) {
            accumulatedText = jsonResponse.choices[0].message.content;
            updateStreamingMessage(messageId, accumulatedText);
          }
        } catch (e) {
          throw new Error('无法解析API响应');
        }
      }
      
    } catch (error) {
      // 如果流式调用失败，回退到普通API调用
      console.log('流式API调用失败，回退到普通调用:', error.message);
      const fallbackResponse = await callOpenAIAPI(provider, message);
      updateStreamingMessage(messageId, fallbackResponse);
    } finally {
      // 标记流式传输完成
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
    }
  };

  // 非流式API调用（用于不支持流式的供应商）
  const callNonStreamAPI = async (provider, message, messageId) => {
    let response;
    
    switch (settings.selectedProvider) {
      case 'anthropic':
        response = await callAnthropicAPI(provider, message);
        break;
      case 'google':
        response = await callGoogleAPI(provider, message);
        break;
      case 'custom':
        response = await callCustomAPI(provider, message);
        break;
      default:
        throw new Error('未支持的供应商');
    }

    updateStreamingMessage(messageId, response);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isStreaming: false }
        : msg
    ));
  };

  // 更新流式消息
  const updateStreamingMessage = (messageId, text) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, text }
        : msg
    ));
    
    // 自动滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  // OpenAI API调用
  const callOpenAIAPI = async (provider, message) => {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.selectedModel,
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `OpenAI API错误: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // DeepSeek API调用
  const callDeepSeekAPI = async (provider, message) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
    
    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.selectedModel,
          messages: [
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `DeepSeek API错误: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请检查网络连接');
      }
      throw error;
    }
  };

  // Anthropic API调用
  const callAnthropicAPI = async (provider, message) => {
    const response = await fetch(`${provider.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: provider.selectedModel,
        max_tokens: 1000,
        messages: [
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Anthropic API错误: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  };

  // Google API调用
  const callGoogleAPI = async (provider, message) => {
    const response = await fetch(`${provider.baseUrl}/models/${provider.selectedModel}:generateContent?key=${provider.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: message }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Google API错误: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  // 自定义API调用
  const callCustomAPI = async (provider, message) => {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.selectedModel,
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `自定义API错误: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const updateProviderSetting = (providerId, key, value) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [providerId]: {
          ...prev.providers[providerId],
          [key]: value,
        },
      },
    }));
  };

  const toggleProvider = (providerId) => {
    const newEnabled = !settings.providers[providerId].enabled;
    updateProviderSetting(providerId, 'enabled', newEnabled);
    
    if (newEnabled && settings.selectedProvider === providerId) {
      // 如果启用了当前选中的提供商，不需要做额外操作
    } else if (!newEnabled && settings.selectedProvider === providerId) {
      // 如果禁用了当前选中的提供商，切换到第一个启用的
      const enabledProvider = Object.keys(settings.providers).find(
        id => id !== providerId && settings.providers[id].enabled
      );
      if (enabledProvider) {
        setSettings(prev => ({ ...prev, selectedProvider: enabledProvider }));
      }
    }
  };

  const saveSettings = () => {
    Alert.alert('保存成功', '设置已保存！', [
      { text: '确定', onPress: () => setShowSettings(false) }
    ]);
  };

  const renderMessage = ({ item, index }) => {
    return (
      <MessageItem
        item={item}
        index={index}
        messages={messages}
        typingAnimation={typingAnimation}
        settings={settings}
        markdownStyles={markdownStyles}
      />
    );
  };

  const handleProviderSelect = (providerId) => {
    if (settings.providers[providerId].enabled) {
      setSettings(prev => ({ ...prev, selectedProvider: providerId }));
    }
  };

  if (showSettings) {
    return (
      <SettingsModal
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSave={saveSettings}
        onProviderSettingUpdate={updateProviderSetting}
        onToggleProvider={toggleProvider}
        onProviderSelect={handleProviderSelect}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 标题栏 */}
      <ChatHeader 
        settings={settings}
        onSettingsPress={() => setShowSettings(true)}
      />

      {/* 消息列表 */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => 
            <TypingIndicator 
              isLoading={isLoading}
              settings={settings}
              typingAnimation={typingAnimation}
            />
          }
        />
      </View>

      {/* 输入区域 */}
      <MessageInput
        inputText={inputText}
        setInputText={setInputText}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 100,
  },
});

