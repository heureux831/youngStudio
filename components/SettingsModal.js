import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Animated,
  TouchableOpacity,
  Text
} from 'react-native';
import { 
  Appbar,
  Text as PaperText,
  Surface,
  Switch,
  TextInput,
  Chip,
  Card,
  Button,
  useTheme,
  Divider
} from 'react-native-paper';

const SettingsModal = ({ 
  settings, 
  onClose, 
  onSave, 
  onProviderSettingUpdate, 
  onToggleProvider, 
  onProviderSelect 
}) => {
  const theme = useTheme();
  
  // 控制模型选择菜单的显示状态
  const [modelMenuVisible, setModelMenuVisible] = useState({});
  const [menuAnimations, setMenuAnimations] = useState({});
  
  // 获取或创建动画值
  const getMenuAnimation = (providerId) => {
    if (!menuAnimations[providerId]) {
      setMenuAnimations(prev => ({
        ...prev,
        [providerId]: {
          scale: new Animated.Value(0)
        }
      }));
      return {
        scale: new Animated.Value(0)
      };
    }
    return menuAnimations[providerId];
  };
  
  // 显示模型选择菜单
  const showModelMenu = (providerId) => {
    setModelMenuVisible(prev => ({ ...prev, [providerId]: true }));
    const animation = getMenuAnimation(providerId);
    
    Animated.spring(animation.scale, {
      toValue: 1,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };
  
  // 隐藏模型选择菜单
  const hideModelMenu = (providerId) => {
    const animation = getMenuAnimation(providerId);
    
    Animated.spring(animation.scale, {
      toValue: 0,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start(() => {
      setModelMenuVisible(prev => ({ ...prev, [providerId]: false }));
    });
  };
  
  // 选择模型
  const selectModel = (providerId, model) => {
    onProviderSettingUpdate(providerId, 'selectedModel', model);
    // 延迟关闭菜单，给用户一个视觉确认的时间
    setTimeout(() => {
      hideModelMenu(providerId);
    }, 500); // 500毫秒延迟
  };
  
  const renderProviderSettings = (providerId) => {
    const provider = settings.providers[providerId];
    return (
      <Card key={providerId} style={styles.providerCard} mode="outlined">
        <Card.Content>
          <View style={styles.providerHeader}>
            <PaperText variant="titleMedium" style={styles.providerName}>
              {provider.icon} {provider.name}
            </PaperText>
            <Switch
              value={provider.enabled}
              onValueChange={() => onToggleProvider(providerId)}
            />
          </View>
          
          {provider.enabled && (
            <View style={styles.providerDetails}>
              <Divider style={styles.divider} />
              
              <PaperText variant="labelMedium" style={styles.inputLabel}>
                API 密钥
              </PaperText>
              <TextInput
                mode="outlined"
                value={provider.apiKey}
                onChangeText={(text) => onProviderSettingUpdate(providerId, 'apiKey', text)}
                placeholder="输入API密钥"
                secureTextEntry
                style={styles.textInput}
                dense
              />
              
              <PaperText variant="labelMedium" style={styles.inputLabel}>
                基础URL
              </PaperText>
              <TextInput
                mode="outlined"
                value={provider.baseUrl}
                onChangeText={(text) => onProviderSettingUpdate(providerId, 'baseUrl', text)}
                placeholder="输入基础URL"
                style={styles.textInput}
                dense
              />
              
              <PaperText variant="labelMedium" style={styles.inputLabel}>
                模型
              </PaperText>
              <View style={styles.dropdownContainer}>
                <Button
                  mode="outlined"
                  onPress={() => showModelMenu(providerId)}
                  style={styles.modelDropdown}
                  contentStyle={styles.modelDropdownContent}
                  icon="chevron-down"
                >
                  {provider.selectedModel}
                </Button>
                
                {modelMenuVisible[providerId] && (
                  <>
                    {/* 背景遮罩 */}
                    <TouchableOpacity
                      style={styles.overlay}
                      onPress={() => hideModelMenu(providerId)}
                      activeOpacity={1}
                    />
                    
                    {/* 动画下拉菜单 */}
                    <Animated.View
                      style={[
                        styles.animatedMenu,
                        {
                          transform: [
                            { scale: getMenuAnimation(providerId).scale }
                          ]
                        }
                      ]}
                    >
                      <Surface style={styles.menuSurface}>
                        {provider.models.map((model, index) => (
                          <TouchableOpacity
                            key={model}
                            onPress={() => selectModel(providerId, model)}
                            style={[
                              styles.menuItemContainer,
                              provider.selectedModel === model && styles.selectedMenuItemContainer,
                              index === provider.models.length - 1 && styles.lastMenuItem
                            ]}
                          >
                            <View style={styles.menuItemContent}>
                              {provider.selectedModel === model && (
                                <Text style={styles.checkIcon}>✓</Text>
                              )}
                              <Text
                                style={[
                                  styles.menuItemText,
                                  provider.selectedModel === model && styles.selectedModelText
                                ]}
                              >
                                {model}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </Surface>
                    </Animated.View>
                  </>
                )}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction 
          onPress={onClose}
          iconColor={theme.colors.onPrimary}
        />
        <Appbar.Content 
          title="设置" 
          titleStyle={{ color: theme.colors.onPrimary }}
        />
        <Appbar.Action 
          icon="check" 
          onPress={onSave}
          iconColor={theme.colors.onPrimary}
        />
      </Appbar.Header>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.sectionCard} mode="outlined">
          <Card.Content>
            <PaperText variant="headlineSmall" style={styles.sectionTitle}>
              AI 模型供应商
            </PaperText>
            
            <PaperText variant="bodyMedium" style={styles.sectionDescription}>
              选择当前使用的AI服务提供商
            </PaperText>
            
            {Object.keys(settings.providers).filter(id => settings.providers[id].enabled).length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.providerSelector}
              >
                <View style={styles.providerChips}>
                  {Object.keys(settings.providers)
                    .filter(id => settings.providers[id].enabled)
                    .map(providerId => (
                      <Chip
                        key={providerId}
                        mode={settings.selectedProvider === providerId ? "flat" : "outlined"}
                        selected={settings.selectedProvider === providerId}
                        onPress={() => onProviderSelect(providerId)}
                        disabled={!settings.providers[providerId].enabled}
                        style={styles.providerChip}
                        icon={() => (
                          <Text style={styles.providerIcon}>
                            {settings.providers[providerId].icon}
                          </Text>
                        )}
                      >
                        {settings.providers[providerId].name}
                      </Chip>
                    ))
                  }
                </View>
              </ScrollView>
            ) : (
              <PaperText variant="bodyMedium" style={styles.noProvidersText}>
                请先在下方启用至少一个AI供应商
              </PaperText>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard} mode="outlined">
          <Card.Content>
            <PaperText variant="headlineSmall" style={styles.sectionTitle}>
              供应商配置
            </PaperText>
          </Card.Content>
        </Card>
        
        {Object.keys(settings.providers).map(renderProviderSettings)}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.7,
  },
  providerSelector: {
    marginBottom: 16,
  },
  providerChips: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  providerChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  providerIcon: {
    fontSize: 14,
  },
  noProvidersText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    marginVertical: 16,
  },
  providerCard: {
    marginBottom: 16,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontWeight: 'bold',
  },
  providerDetails: {
    marginTop: 8,
  },
  divider: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    marginTop: 12,
    fontWeight: 'bold',
  },
  textInput: {
    marginBottom: 8,
  },
  modelDropdown: {
    marginBottom: 8,
    justifyContent: 'flex-start',
    minWidth: 200, // 设置按钮最小宽度
  },
  modelDropdownContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 9998,
    backgroundColor: 'transparent',
  },
  animatedMenu: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    transformOrigin: 'top',
  },
  menuSurface: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuItemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  selectedMenuItemContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderBottomColor: 'rgba(33, 150, 243, 0.2)',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  selectedModelText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  menuItemText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default SettingsModal; 