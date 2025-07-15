import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { 
  Text, 
  Surface, 
  Avatar, 
  List, 
  Switch, 
  Divider,
  Button,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function ProfileScreen() {
  const { settings, updateSetting, getStats } = useAppContext();
  const stats = getStats();

  const toggleSetting = (key) => {
    updateSetting(key, !settings[key]);
  };

  const handleExport = () => {
    Alert.alert('导出数据', '将所有笔记导出为JSON文件', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => console.log('导出数据') }
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      '清除数据', 
      '此操作将删除所有笔记和项目，无法恢复！',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          style: 'destructive',
          onPress: () => console.log('清除数据') 
        }
      ]
    );
  };

  const MenuItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <MaterialIcons name={icon} size={20} color="#666" />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (
        <MaterialIcons name="chevron-right" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, color, icon }) => (
    <Surface style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 个人信息卡片 */}
        <Surface style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={64} 
              label="用" 
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>用户</Text>
              <Text style={styles.profileEmail}>user@example.com</Text>
              <Text style={styles.memberSince}>使用 MyStudio 已有 30 天</Text>
            </View>
          </View>
          
          <Button 
            mode="outlined" 
            style={styles.editProfileButton}
            onPress={() => console.log('编辑资料')}
          >
            编辑资料
          </Button>
        </Surface>

        {/* 数据统计 */}
        <View style={styles.statsContainer}>
          <StatCard 
            title="总笔记" 
            value={stats.totalNotes.toString()} 
            color="#1976d2" 
            icon="description"
          />
          <StatCard 
            title="项目数" 
            value={stats.totalProjects.toString()} 
            color="#f57c00" 
            icon="folder"
          />
          <StatCard 
            title="子项目" 
            value={stats.totalSubProjects.toString()} 
            color="#4caf50" 
            icon="assignment"
          />
        </View>

        {/* 应用设置 */}
        <Surface style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>应用设置</Text>
          
          <MenuItem
            icon="notifications"
            title="推送通知"
            subtitle="接收新笔记和提醒通知"
            rightComponent={
              <Switch 
                value={settings.notifications}
                onValueChange={() => toggleSetting('notifications')}
              />
            }
          />
          
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="brightness-6"
            title="深色模式"
            subtitle="使用深色主题"
            rightComponent={
              <Switch 
                value={settings.darkMode}
                onValueChange={() => toggleSetting('darkMode')}
              />
            }
          />
          
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="sync"
            title="自动同步"
            subtitle="在WiFi环境下自动备份数据"
            rightComponent={
              <Switch 
                value={settings.autoSync}
                onValueChange={() => toggleSetting('autoSync')}
              />
            }
          />
          
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="fingerprint"
            title="生物识别"
            subtitle="使用指纹或面容ID保护应用"
            rightComponent={
              <Switch 
                value={settings.biometric}
                onValueChange={() => toggleSetting('biometric')}
              />
            }
          />
        </Surface>

        {/* 数据管理 */}
        <Surface style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>数据管理</Text>
          
          <MenuItem
            icon="cloud-upload"
            title="备份数据"
            subtitle="将数据备份到云端"
            onPress={() => console.log('备份数据')}
          />
          
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="download"
            title="导出数据"
            subtitle="导出所有笔记为文件"
            onPress={handleExport}
          />
          
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="restore"
            title="恢复数据"
            subtitle="从备份文件恢复数据"
            onPress={() => console.log('恢复数据')}
          />
        </Surface>

        {/* 其他 */}
        <Surface style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>其他</Text>
          
          <MenuItem
            icon="help"
            title="帮助与支持"
            subtitle="使用指南和常见问题"
            onPress={() => console.log('帮助')}
          />
          
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="info"
            title="关于应用"
            subtitle="版本信息和开发者"
            onPress={() => console.log('关于')}
          />
          
          <Divider style={styles.divider} />
          
          <MenuItem
            icon="star"
            title="评价应用"
            subtitle="在应用商店给我们评分"
            onPress={() => console.log('评价')}
          />
        </Surface>

        {/* 危险操作 */}
        <Surface style={[styles.settingsSection, styles.dangerSection]}>
          <MenuItem
            icon="delete-forever"
            title="清除所有数据"
            subtitle="删除所有笔记和设置"
            onPress={handleClearData}
          />
        </Surface>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#1976d2',
    marginRight: 16,
  },
  avatarLabel: {
    fontSize: 24,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2f3437',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#999',
  },
  editProfileButton: {
    borderColor: '#1976d2',
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    elevation: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2f3437',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f3437',
    padding: 20,
    paddingBottom: 0,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2f3437',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    marginLeft: 64,
    marginRight: 20,
  },
  dangerSection: {
    borderColor: '#ffebee',
    backgroundColor: '#ffebee',
  },
  bottomSpacing: {
    height: 100,
  },
}); 