import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Markdown from 'react-native-markdown-display';

const MessageItem = ({ item, index, messages, typingAnimation, settings, markdownStyles }) => {
  const isUser = item.sender === 'user';
  const showAvatar = index === 0 || messages[index - 1]?.sender !== item.sender;
  const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender !== item.sender;
  
  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      showAvatar && styles.messageContainerWithAvatar,
      isLastInGroup && styles.lastMessageInGroup,
    ]}>
      {!isUser && showAvatar && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.provider && settings.providers[item.provider] 
              ? settings.providers[item.provider].icon 
              : '🤖'}
          </Text>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble,
        showAvatar && !isUser && styles.aiBubbleWithAvatar,
        isLastInGroup && (isUser ? styles.userBubbleLast : styles.aiBubbleLast),
      ]}>
        {isUser ? (
          <Text style={[
            styles.messageText,
            styles.userText
          ]}>
            {item.text}
          </Text>
        ) : (
          <View style={styles.aiMessageContainer}>
            <Markdown style={markdownStyles}>
              {item.text}
            </Markdown>
            {item.isStreaming && (
              <Animated.Text style={[
                styles.cursor,
                { opacity: typingAnimation }
              ]}>
                |
              </Animated.Text>
            )}
          </View>
        )}
        
        <View style={styles.messageFooter}>
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.aiTimestamp
          ]}>
            {item.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
          {isUser && (
            <Text style={styles.messageStatus}>✓</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageContainerWithAvatar: {
    marginTop: 8,
  },
  lastMessageInGroup: {
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userBubble: {
    backgroundColor: '#2196F3',
    marginLeft: 50,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  aiBubbleWithAvatar: {
    marginLeft: 0,
  },
  userBubbleLast: {
    borderBottomRightRadius: 4,
  },
  aiBubbleLast: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aiTimestamp: {
    color: '#666',
  },
  messageStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  cursor: {
    fontSize: 16,
    color: '#2196F3',
  },
});

export default MessageItem; 