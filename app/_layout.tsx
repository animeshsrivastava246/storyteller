import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" >
        <Label>Home</Label>
        <Icon sf="house" drawable="custom_home_drawable"/>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="story">
        <Icon sf="book.badge.plus" drawable="custom_home_drawable"/>
        <Label>Story</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
