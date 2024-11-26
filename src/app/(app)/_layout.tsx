import { Tabs, Redirect } from 'expo-router';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Text from '@/ui/text';
import { useAuth } from '@/core/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

function TabLayout() {
  const { status } = useAuth();

  if (status !== 'signIn') {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarInactiveTintColor: '#EBEBF5',
          tabBarLabelStyle: { fontSize: 12, color: '#EBEBF5' },
          tabBarStyle: { height: 60, paddingVertical: 10 },
          tabBarLabel: ({ color, children }) => (
            <Text style={{ color }} variant="subtitle">
              {children}
            </Text>
          )
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Mapa',
            tabBarIcon: ({ focused, color, size }) => (
              // create animation based in the focused propery
              <MaterialCommunityIcons
                name={focused ? 'map' : 'map-outline'}
                size={size}
                color={color}
              />
            )
          }}
        />

        <Tabs.Screen
          name="complaint"
          options={{
            title: 'Denuncia',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="receipt-long" size={size} color={color} />
            )
          }}
        />

        <Tabs.Screen
          name="forums"
          options={{
            title: 'Forum',
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'forum' : 'forum-outline'}
                size={size}
                color={color}
              />
            )
          }}
        />

        <Tabs.Screen
          name="quiz"
          options={{
            title: 'Quiz',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="quiz" size={size} color={color} />
            )
          }}
        />

        <Tabs.Screen
          name="user-profile"
          options={{
            title: 'Usuário',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            )
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

export default TabLayout;
