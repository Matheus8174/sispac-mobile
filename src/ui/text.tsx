'use client';

import { forwardRef } from 'react';
import {
  Platform,
  Text as RNText,
  TextProps as RNTextProps,
  Role
} from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

const text = tv({
  // base: 'font-sans text-white dark:text-white',
  base: 'text-white dark:text-white',
  variants: {
    variant: {
      h1: 'text-3xl font-bold',
      h2: 'text-2xl font-bold',
      h3: 'text-xl font-bold',
      h4: 'text-base font-bold',
      paragraph: 'text-base',
      subtitle: 'text-sm'
    }
  },
  defaultVariants: {
    variant: 'paragraph'
  }
});

type TextVariants = VariantProps<typeof text>;

interface TextProps extends TextVariants, RNTextProps {
  children: React.ReactNode;
  className?: string;
}

const Text = forwardRef<RNText, TextProps>(
  ({ children, variant = 'paragraph', className, ...rest }, ref) => {

    return (
      <RNText
        className={text({ className, variant })}
        ref={ref}
        {...rest}
      >
        {children}
      </RNText>
    );
  }
);

export default Text;
