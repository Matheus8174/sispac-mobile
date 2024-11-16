import React, { useState } from 'react';

import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { useThemeConfig } from '@/core/hooks/use-theme-config';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Text from './text';

interface ImageUploadProps extends TouchableOpacityProps {
  text?: string;
}

export type ImageUploadRef = {
  setAmountFiles: (d: number) => void;
};

const ImageUpload = React.forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ text = 'escolher arquivos', ...rest }, forwardRef) => {
    const { colors } = useThemeConfig();

    const [amountFiles, setAmountFiles] = useState(0);

    React.useImperativeHandle(forwardRef, () => ({
      setAmountFiles
    }));

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className="relative flex-1 gap-4 rounded-xl border-dashed border-2 border-blue-100 justify-center items-center"
        {...rest}
      >
        <View className="right-3 top-3 size-9 items-center justify-center rounded-full bg-red-100 absolute">
          <Text variant="h4">{amountFiles}</Text>
        </View>
        <MaterialCommunityIcons
          name="camera-plus"
          size={40}
          color={colors.primary}
        />

        <Text variant="h4">{text}</Text>
      </TouchableOpacity>
    );
  }
);

export default ImageUpload;
