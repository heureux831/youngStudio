import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Surface,
  Text,
  List,
  Divider,
  useTheme,
  Avatar,
} from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

const SideMenu = ({ 
  visible, 
  onClose, 
  onSettingsPress,
  settings 
}) => {
  const theme = useTheme();
  const currentProvider = settings.providers[settings.selectedProvider];
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsAnimating(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsAnimating(false);
      });
    } else if (shouldRender) {
      setIsAnimating(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIsAnimating(false);
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!shouldRender && !isAnimating) return null;

  return (
    <View style={styles.container}>
      {/* 背景遮罩 */}
      <Animated.View
        style={[
          styles.overlay,
          { opacity: opacityAnim }
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      
      {/* 侧边栏内容 */}
      <Animated.View
        style={[
          styles.sidebar,
          { 
            backgroundColor: theme.colors.surface,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <Surface style={styles.sidebarSurface} elevation={16}>
          {/* 头部信息 */}
          <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
            <Avatar.Text 
              size={60}
              label={currentProvider.icon}
              style={{ 
                backgroundColor: theme.colors.primary,
                marginBottom: 12
              }}
              color={theme.colors.onPrimary}
            />
            <Text 
              variant="titleLarge" 
              style={{ 
                color: theme.colors.onPrimary,
                fontWeight: 'bold',
                marginBottom: 4
              }}
            >
              AI 聊天助手
            </Text>
            <Text 
              variant="bodyMedium" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              {currentProvider.name} • {currentProvider.selectedModel}
            </Text>
          </View>

          {/* 菜单项 */}
          <View style={styles.menuItems}>
            <List.Item
              title="设置"
              description="配置AI供应商和模型"
              left={(props) => <List.Icon {...props} icon="cog" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                onSettingsPress();
                onClose();
              }}
              style={styles.menuItem}
            />
            
            <Divider />
            
            <List.Item
              title="关于"
              description="应用信息和版本"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // TODO: 添加关于页面
                onClose();
              }}
              style={styles.menuItem}
            />
            
            <Divider />
            
            <List.Item
              title="帮助"
              description="使用指南和常见问题"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // TODO: 添加帮助页面
                onClose();
              }}
              style={styles.menuItem}
            />
          </View>

          {/* 底部信息 */}
          <View style={styles.footer}>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              版本 1.0.0
            </Text>
          </View>
        </Surface>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: Math.min(300, screenWidth * 0.8),
  },
  sidebarSurface: {
    flex: 1,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  menuItems: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    paddingVertical: 4,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default SideMenu; 