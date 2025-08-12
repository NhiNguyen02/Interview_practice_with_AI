import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import AppLayout from '@/components/custom/AppLayout';

export default function TabLayout() {
  
  return (
    <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.aqua,
          tabBarInactiveTintColor:Colors.white,
          headerShown: false,

          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {
              backgroundColor: Colors.darkPurpleBlue,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              height: 69,
              margin: 0,
              paddingTop: 0,
              borderTopWidth: 0,
              paddingBottom: 0,
              position: 'absolute',
            },
          }),
          tabBarItemStyle: {
                  
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 6, // tạo khoảng cách trên dưới đều

          },
        }}>
        <Tabs.Screen
        name="index"
        options={{
          title: 'index',
          tabBarLabel: 'TabsIndex',
          href: null,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarLabel: 'Trang chủ',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarLabel: 'Lịch sử',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarLabel: 'Tiến trình',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Saved',
            tabBarLabel: 'Đã lưu',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="bookmark.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarLabel: 'Cài đặt',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
          }}
        />
      </Tabs>
    
  );
}
