import { Tabs } from 'expo-router';
import { C } from '../../theme';
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: C.accent, headerStyle: { backgroundColor: C.bg }, headerTitleStyle: { color: C.ink }, tabBarStyle: { backgroundColor: C.bg } }}>
      <Tabs.Screen name="index" options={{ title: 'Hôm nay', tabBarLabel: 'Hôm nay' }} />
      <Tabs.Screen name="review" options={{ title: 'Ôn thẻ', tabBarLabel: 'Ôn thẻ' }} />
      <Tabs.Screen name="tutor" options={{ title: 'Gia sư AI', tabBarLabel: 'Gia sư AI' }} />
      <Tabs.Screen name="progress" options={{ title: 'Tiến độ', tabBarLabel: 'Tiến độ' }} />
    </Tabs>
  );
}
