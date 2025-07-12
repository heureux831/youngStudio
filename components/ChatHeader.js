import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ChatHeader = ({ settings, onSettingsPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>
            {settings.providers[settings.selectedProvider].icon}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI 聊天助手</Text>
          <Text style={styles.headerSubtitle}>
            {settings.providers[settings.selectedProvider].name} • {settings.providers[settings.selectedProvider].selectedModel}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={onSettingsPress}
      >
        <Text style={styles.settingsText}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderBottomWidth: 1,
    borderBottomColor: '#1976D2',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarText: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
  },
  settingsText: {
    fontSize: 18,
  },
});

export default ChatHeader; 