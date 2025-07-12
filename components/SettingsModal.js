import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  Switch, 
  Platform 
} from 'react-native';

const SettingsModal = ({ 
  settings, 
  onClose, 
  onSave, 
  onProviderSettingUpdate, 
  onToggleProvider, 
  onProviderSelect 
}) => {
  const renderProviderSettings = (providerId) => {
    const provider = settings.providers[providerId];
    return (
      <View key={providerId} style={styles.providerContainer}>
        <View style={styles.providerHeader}>
          <Text style={styles.providerName}>{provider.icon} {provider.name}</Text>
          <Switch
            value={provider.enabled}
            onValueChange={() => onToggleProvider(providerId)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={provider.enabled ? '#2196F3' : '#f4f3f4'}
          />
        </View>
        
        {provider.enabled && (
          <View style={styles.providerDetails}>
            <Text style={styles.inputLabel}>API 密钥</Text>
            <TextInput
              style={styles.settingsInput}
              value={provider.apiKey}
              onChangeText={(text) => onProviderSettingUpdate(providerId, 'apiKey', text)}
              placeholder="输入API密钥"
              secureTextEntry
            />
            
            <Text style={styles.inputLabel}>基础URL</Text>
            <TextInput
              style={styles.settingsInput}
              value={provider.baseUrl}
              onChangeText={(text) => onProviderSettingUpdate(providerId, 'baseUrl', text)}
              placeholder="输入基础URL"
            />
            
            <Text style={styles.inputLabel}>模型</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.modelChips}>
                {provider.models.map(model => (
                  <TouchableOpacity
                    key={model}
                    style={[
                      styles.modelChip,
                      provider.selectedModel === model && styles.selectedModelChip
                    ]}
                    onPress={() => onProviderSettingUpdate(providerId, 'selectedModel', model)}
                  >
                    <Text style={[
                      styles.modelChipText,
                      provider.selectedModel === model && styles.selectedModelChipText
                    ]}>
                      {model}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.settingsTitle}>设置</Text>
        <TouchableOpacity onPress={onSave}>
          <Text style={styles.saveButton}>保存</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.settingsContent}>
        <Text style={styles.sectionTitle}>AI 模型供应商</Text>
        
        <Text style={styles.sectionDescription}>
          选择当前使用的AI服务提供商
        </Text>
        
        <View style={styles.providerSelector}>
          {Object.keys(settings.providers).map(providerId => (
            <TouchableOpacity
              key={providerId}
              style={[
                styles.providerOption,
                settings.selectedProvider === providerId && styles.selectedProviderOption
              ]}
              onPress={() => onProviderSelect(providerId)}
              disabled={!settings.providers[providerId].enabled}
            >
              <Text style={[
                styles.providerOptionText,
                settings.selectedProvider === providerId && styles.selectedProviderOptionText,
                !settings.providers[providerId].enabled && styles.disabledProviderOptionText
              ]}>
                {settings.providers[providerId].icon} {settings.providers[providerId].name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>供应商配置</Text>
        
        {Object.keys(settings.providers).map(renderProviderSettings)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#fff',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  providerSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  providerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedProviderOption: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  providerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedProviderOptionText: {
    color: '#fff',
  },
  disabledProviderOptionText: {
    color: '#ccc',
  },
  providerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  providerDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    marginTop: 8,
  },
  settingsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  modelChips: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  modelChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedModelChip: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  modelChipText: {
    fontSize: 12,
    color: '#333',
  },
  selectedModelChipText: {
    color: '#fff',
  },
});

export default SettingsModal; 