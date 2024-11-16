import { PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';

import Text from './text';

const FormControl = ({ children, ...props }: PropsWithChildren<ViewProps>) => (
  <View className="relative">
    <View className="gap-4" {...props}>
      {children}
    </View>
  </View>
);

const Label = ({ children }: PropsWithChildren) => (
  <Text variant="paragraph" className="!text-[#ebebf599]">
    {children}
  </Text>
);

export default {
  Root: FormControl,
  Label
};
