import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme
} from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

import colors from '@/ui/colors';

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    notification: '#EBEBF5',
    primary: colors.blue['100'],
    background: colors.black[200],
    text: colors.white,
    card: colors.black[50],
    border: colors.black[100]
  }
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    card: colors.gray,
    text: colors.black['200'],
    background: colors.white
  }
};

export function useThemeConfig() {
  const { colorScheme } = useColorScheme();

  if (colorScheme === 'dark') return DarkTheme;

  return LightTheme;
}
