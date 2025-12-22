// import { Slot } from "expo-router";
// import { StatusBar } from "expo-status-bar";

// export default function RootLayout() {
//   return (
//     <>
//       <StatusBar
//         style="auto"
//         translucent
//       />
//       <Slot />
//     </>
//   );
// }
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="ic_menu_mylocation" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="story">
        <Icon sf="gear" drawable="ic_menu_mylocation" />
        <Label>Story</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
