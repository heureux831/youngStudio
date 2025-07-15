import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { 
  TextInput, 
  FAB, 
  Surface, 
  useTheme,
  ActivityIndicator
} from 'react-native-paper';

const MessageInput = ({ 
  inputText, 
  setInputText, 
  onSendMessage, 
  isLoading 
}) => {
  const theme = useTheme();
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.inputContainer}
    >
      <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.inputWrapper}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="输入消息..."
              multiline
              maxLength={2000}
              mode="outlined"
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              outlineStyle={styles.textInputOutline}
              disabled={isLoading}
              textAlignVertical="top"
            />
            <View style={styles.characterCount}>
              <Text 
                style={[
                  styles.characterCountText,
                  { color: theme.colors.outline }
                ]}
              >
                {inputText.length}/2000
              </Text>
            </View>
          </View>
          <View style={styles.sendButtonContainer}>
            <FAB
              icon={isLoading ? () => <ActivityIndicator color={theme.colors.onPrimary} size={20} /> : "send"}
              size="small"
              onPress={onSendMessage}
              disabled={!inputText.trim() || isLoading}
              style={[
                styles.sendButton,
                {
                  backgroundColor: (!inputText.trim() || isLoading) 
                    ? theme.colors.surfaceDisabled 
                    : theme.colors.primary
                }
              ]}
            />
          </View>
        </View>
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'transparent',
  },
  surface: {
    elevation: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInputContainer: {
    flex: 1,
    position: 'relative',
    marginRight: 8,
  },
  textInput: {
    minHeight: 48,
    maxHeight: 96,
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  textInputContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24, // 为字符计数留出空间
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  textInputOutline: {
    borderRadius: 20,
    borderWidth: 1,
  },
  characterCount: {
    position: 'absolute',
    bottom: 4,
    right: 14,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  characterCountText: {
    fontSize: 10,
    opacity: 0.5,
    fontWeight: '400',
  },
  sendButtonContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  sendButton: {
    margin: 0,
  },
});

export default MessageInput; 