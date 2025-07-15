import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  PaperProvider, 
  MD3LightTheme as DefaultTheme 
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// 导入页面组件
import QuickNoteScreen from './screens/QuickNoteScreen';
import InboxScreen from './screens/InboxScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProjectItemDetailScreen from './screens/ProjectItemDetailScreen';

// 导入Context
import { AppProvider } from './context/AppContext';

// Paper主题配置
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    secondary: '#1976D2',
    surface: '#ffffff',
    background: '#ffffff',
    onSurface: '#2f3437',
  },
};

// 创建导航器
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 主Tab导航组件
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'QuickNote') {
            iconName = 'edit';
          } else if (route.name === 'Inbox') {
            iconName = 'inbox';
          } else if (route.name === 'Projects') {
            iconName = 'folder';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: '#9aa0a6',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f3f4',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="QuickNote" 
        component={QuickNoteScreen} 
        options={{
          tabBarLabel: '速记',
        }}
      />
      <Tab.Screen 
        name="Inbox" 
        component={InboxScreen} 
        options={{
          tabBarLabel: '输入箱',
        }}
      />
      <Tab.Screen 
        name="Projects" 
        component={ProjectsScreen} 
        options={{
          tabBarLabel: '项目',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: '我的',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen 
              name="ProjectItemDetail" 
              component={ProjectItemDetailScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
}

