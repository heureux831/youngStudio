import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { 
  Card, 
  Text, 
  Avatar, 
  Surface, 
  useTheme,
  Chip
} from 'react-native-paper';
import Markdown from 'react-native-markdown-display';

const MessageItem = ({ item, index, messages, typingAnimation, settings, markdownStyles }) => {
  const theme = useTheme();
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
        <Avatar.Text 
          size={32}
          label={item.provider && settings.providers[item.provider] 
            ? settings.providers[item.provider].icon 
            : '🤖'}
          style={[
            styles.avatar,
            { backgroundColor: theme.colors.surfaceVariant }
          ]}
          labelStyle={{ fontSize: 16 }}
        />
      )}
      
      <Surface style={[
        styles.messageBubble,
        isUser ? {
          backgroundColor: theme.colors.primary,
          marginLeft: 50,
        } : {
          backgroundColor: theme.colors.surface,
          marginRight: 50,
        },
        showAvatar && !isUser && styles.aiBubbleWithAvatar,
      ]} elevation={2}>
        <Card.Content style={styles.messageContent}>
          {isUser ? (
            <Text 
              variant="bodyMedium"
              style={[
                styles.messageText,
                { color: theme.colors.onPrimary }
              ]}
            >
              {item.text}
            </Text>
          ) : (
            <View style={styles.aiMessageContainer}>
              <Markdown style={{
                ...markdownStyles,
                body: {
                  ...markdownStyles.body,
                  color: theme.colors.onSurface,
                },
              }}>
                {item.text}
              </Markdown>
              {item.isStreaming && (
                <Animated.Text style={[
                  styles.cursor,
                  { 
                    opacity: typingAnimation,
                    color: theme.colors.primary 
                  }
                ]}>
                  |
                </Animated.Text>
              )}
            </View>
          )}
          
          <View style={styles.messageFooter}>
            <Text 
              variant="labelSmall" 
              style={[
                styles.timestamp,
                { 
                  color: isUser 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : theme.colors.onSurfaceVariant 
                }
              ]}
            >
              {item.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            {isUser && (
              <Text style={[
                styles.messageStatus, 
                { color: 'rgba(255, 255, 255, 0.8)' }
              ]}>
                ✓
              </Text>
            )}
            {!isUser && item.provider && (
              <Chip 
                mode="outlined" 
                compact 
                style={styles.providerChip}
                textStyle={styles.providerChipText}
              >
                {settings.providers[item.provider]?.name || item.provider}
              </Chip>
            )}
          </View>
        </Card.Content>
      </Surface>
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
  },
  messageContainerWithAvatar: {
    marginTop: 8,
  },
  lastMessageInGroup: {
    marginBottom: 12,
  },
  avatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
  },
  aiBubbleWithAvatar: {
    marginLeft: 0,
  },
  messageContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  messageStatus: {
    fontSize: 12,
    marginLeft: 4,
  },
  cursor: {
    fontSize: 16,
  },
  providerChip: {
    height: 20,
    marginLeft: 8,
  },
  providerChipText: {
    fontSize: 10,
    lineHeight: 12,
  },
});

export default MessageItem; 