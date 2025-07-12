import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const TypingIndicator = ({ isLoading, settings, typingAnimation }) => {
  if (!isLoading) return null;
  
  return (
    <View style={[styles.messageContainer, styles.aiMessageContainer, styles.typingContainer]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {settings.providers[settings.selectedProvider].icon}
        </Text>
      </View>
      <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
        <View style={styles.typingDots}>
          <Animated.View style={[
            styles.typingDot,
            { opacity: typingAnimation }
          ]} />
          <Animated.View style={[
            styles.typingDot,
            { 
              opacity: typingAnimation,
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
            { opacity: typingAnimation }
          ]} />
        </View>
        <Text style={styles.typingText}>
          {settings.providers[settings.selectedProvider].name} 正在输入...
        </Text>
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
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  typingContainer: {
    marginVertical: 8,
    marginLeft: 40,
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
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  typingBubble: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '70%',
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TypingIndicator; 