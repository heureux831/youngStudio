import React from 'react';
import { View } from 'react-native';
import { 
  Appbar, 
  Text, 
  Avatar, 
  Surface, 
  useTheme 
} from 'react-native-paper';

const ChatHeader = ({ settings, onMenuPress }) => {
  const theme = useTheme();
  const currentProvider = settings.providers[settings.selectedProvider];
  
  return (
    <Surface style={{ elevation: 4 }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.Action 
          icon="menu"
          iconColor={theme.colors.onPrimary}
          onPress={onMenuPress}
        />
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          flex: 1, 
          marginLeft: 8 
        }}>
          <Avatar.Text 
            size={40}
            label={currentProvider.icon}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              marginRight: 12 
            }}
          />
          <View style={{ flex: 1 }}>
            <Text 
              variant="titleMedium" 
              style={{ 
                color: theme.colors.onPrimary,
                fontWeight: 'bold' 
              }}
            >
              AI 聊天助手
            </Text>
            <Text 
              variant="bodySmall" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                marginTop: 2 
              }}
            >
              {currentProvider.name} • {currentProvider.selectedModel}
            </Text>
          </View>
        </View>
      </Appbar.Header>
    </Surface>
  );
};

export default ChatHeader; 