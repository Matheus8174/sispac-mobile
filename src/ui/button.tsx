import type {
  TextProps as RNTextProps,
  TouchableOpacityProps
} from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { Text as RNText, TouchableOpacity } from 'react-native';
import { tv } from 'tailwind-variants';

const button = tv({
  slots: {
    root: 'items-center justify-center rounded-md px-8 py-3',
    text: 'text-base font-bold'
  },
  variants: {
    disabled: {
      true: {
        root: '!bg-slate-500'
      }
    },
    variant: {
      outlined: {
        root: 'border-[1px] border-white bg-transparent',
        text: 'text-black-200 dark:text-white'
      },
      contained: {
        root: 'bg-blue-100'
      }
    }
  },
  defaultVariants: {
    disable: false,
    variant: 'contained'
  }
});

type ButtonVariants = VariantProps<typeof button>;

interface ButtonProps extends TouchableOpacityProps, ButtonVariants {
  children: React.ReactNode;
}

const { root, text } = button();

function Root(props: ButtonProps) {
  const { children, className, variant, disabled, ...rest } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      className={root({ className, disabled, variant })}
      activeOpacity={0.7}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

interface TextProps extends RNTextProps, ButtonVariants {
  children: React.ReactNode;
  className?: string;
}

function Text({ className, children, variant, ...rest }: TextProps) {
  return (
    <RNText className={text({ className, variant })} {...rest}>
      {children}
    </RNText>
  );
}

const Button = {
  Text,
  Root
};

export default Button;
