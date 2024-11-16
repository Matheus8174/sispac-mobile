import React from 'react';

import { Image as ExpoImage, ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';

export interface ImageRef {
  update: () => void;
}

const ImageStyleable = cssInterop(ExpoImage, {
  className: {
    target: 'style'
  }
});

const Image = React.forwardRef<ImageRef, ImageProps>((props, forwardRef) => {
  const [refresh, setRefresh] = React.useState(false);

  React.useImperativeHandle(forwardRef, () => ({
    update: () => {
      setRefresh((prev) => !prev);
    }
  }));

  return <ImageStyleable key={refresh} {...props} />;
});

export default Image;
