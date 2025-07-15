import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { 
  Avatar, 
  Surface, 
  Text, 
  useTheme,
  ActivityIndicator
} from 'react-native-paper';

const TypingIndicator = ({ isLoading, settings, typingAnimation }) => {
  const theme = useTheme();
  
  if (!isLoading) return null;
  
  return (
    <View style={[styles.messageContainer, styles.aiMessageContainer, styles.typingContainer]}>
      <Avatar.Text 
        size={32}
        label={settings.providers[settings.selectedProvider].icon}
        style={[
          styles.avatar,
          { backgroundColor: theme.colors.surfaceVariant }
        ]}
        labelStyle={{ fontSize: 16 }}
      />
      <Surface style={[
        styles.messageBubble, 
        { backgroundColor: theme.colors.surface }
      ]} elevation={2}>
        <View style={styles.typingContent}>
          <View style={styles.typingDots}>
            <ActivityIndicator 
              size="small" 
              color={theme.colors.primary}
              style={styles.indicator}
            />
            <Animated.View style={[
              styles.typingDot,
              { 
                opacity: typingAnimation,
                backgroundColor: theme.colors.primary
              }
            ]} />
            <Animated.View style={[
              styles.typingDot,
              { 
                opacity: typingAnimation,
                backgroundColor: theme.colors.primary,
                transform: [{ 
                  scale: typingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2]
                  })
                }]
              }
            ]} />
            <Animated.View style={[
              styles.typingDot,
              { 
                opacity: typingAnimation,
                backgroundColor: theme.colors.primary
              }
            ]} />
          </View>
          <Text 
            variant="bodySmall" 
            style={[
              styles.typingText,
              { color: theme.colors.onSurfaceVariant }
            ]}
          >
            {settings.providers[settings.selectedProvider].name} 正在输入...
          </Text>
        </View>
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
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  typingContainer: {
    marginVertical: 8,
  },
  avatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 18,
  },
  typingContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicator: {
    marginRight: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  typingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TypingIndicator; 