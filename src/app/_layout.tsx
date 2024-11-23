import '../../global.css';

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, SplashScreen, router } from 'expo-router';
import { useThemeConfig } from '@/core/hooks/use-theme-config';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { View } from 'react-native';

import { KeyboardProvider } from 'react-native-keyboard-controller';
import { hydrateAuth } from '@/core/auth';
import { removeToken } from '@/core/auth/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const unstable_settings = {
  initialRouteName: '(app)'
};

SplashScreen.preventAutoHideAsync();

hydrateAuth().then(async () => {
  await SplashScreen.hideAsync();
});

function RootLayout() {
  const theme = useThemeConfig();

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <KeyboardProvider>
          <ThemeProvider value={theme}>
            <BottomSheetModalProvider>
              <Stack
                screenOptions={{
                  statusBarAnimation: 'slide',
                  navigationBarColor: theme.colors.background,
                  statusBarStyle: theme.dark ? 'light' : 'dark',
                  statusBarColor: theme.colors.background,
                  headerShown: false
                }}
              >
                <Stack.Screen
                  name="(app)"
                  options={{
                    navigationBarColor: theme.colors.card
                  }}
                />

                <Stack.Screen name="login" />

                <Stack.Screen name="register" />

                <Stack.Screen
                  name="modal"
                  options={{
                    animation: 'none',
                    presentation: 'transparentModal',
                    navigationBarColor: '#10141f'
                  }}
                />

                <Stack.Screen
                  name="forum/[id]"
                  options={{
                    headerShown: true,
                    headerTitle: '',
                    headerLeft: ({ tintColor }) => (
                      <MaterialCommunityIcons
                        size={30}
                        name="arrow-left"
                        onPress={router.back}
                        color={tintColor}
                      />
                    ),
                    statusBarColor: theme.colors.card
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </View>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
