// app/_layout.tsx — tab-based root
import { Tabs } from 'expo-router/tabs';
import { Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ color }) => <Icon sf="star.fill" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => <Icon sf="clock.fill" />,
        }}
      />
    </Tabs>
  );
}