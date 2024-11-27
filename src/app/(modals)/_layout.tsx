import { Slot, router } from 'expo-router';

import { StyleSheet, View } from 'react-native';

function Layout() {
  return (
    <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
      <View
        style={StyleSheet.absoluteFill}
        onTouchStart={() => router.dismiss()}
      />

      <Slot />
    </View>
  );
}

export default Layout;
