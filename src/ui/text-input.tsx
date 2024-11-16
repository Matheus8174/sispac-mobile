'use client';

import type { TextInputProps as RNTextInputProps } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

import colors from '@/ui/colors';

import Text from '@/ui/text';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController
} from 'react-hook-form';

const textInput = tv({
  slots: {
    errorText:
      'absolute bottom-0 translate-y-full text-red-100 dark:text-red-100',
    root: 'placeholder:text-gray rounded-md p-4 text-white',

    icon: 'absolute size-9 -translate-x-4 items-center justify-center self-end text-white'
  },
  variants: {
    options: {
      true: {}
    },
    password: {
      true: {
        icon: 'hidden'
      }
    },
    variant: {
      contained: {
        root: 'bg-black-50'
      },
      outlined: {
        root: 'border-[1px] border-white bg-transparent'
      },
      ['outlined-gray']: {
        root: 'rounded-xl border-[1px] border-[#ebebf599] bg-transparent placeholder:text-[#ebebf599]'
      }
    }
  },
  defaultVariants: {
    password: false,
    error: false,
    variant: 'contained'
  }
});

const { root, icon, errorText } = textInput();

type TextInputVariants = VariantProps<typeof textInput>;

export interface TextInputProps
  extends Omit<TextInputVariants, 'error'>,
    RNTextInputProps {
  error?: string;
  placeholderAnimation?: boolean;
}

const toValue = -45;

const AnimatedText = Animated.createAnimatedComponent(Text);

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (props, fowardedRef) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const ref = React.useRef<RNTextInput>(null);

    const {
      className,
      variant,
      password,
      options,
      error,
      placeholder,
      onChangeText,
      placeholderAnimation = false,
      ...rest
    } = props;

    const translateY = useSharedValue(0);

    const animation = useAnimatedStyle(
      () => ({
        transform: [{ translateY: translateY.value }]
      }),
      [translateY]
    );

    function handleTextChange(text: string) {
      if (text.length === 0) translateY.value = withSpring(0);

      if (text.length >= 1) translateY.value = withSpring(toValue);

      if (onChangeText) onChangeText(text);
    }

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const styles = root({ className, variant });

    const rightIconStyle = icon({ className, variant });

    React.useImperativeHandle(fowardedRef, () => ref.current!);

    return (
      <View
        className="relative justify-center"
        onTouchStart={() => ref.current?.focus()}
      >
        <RNTextInput
          ref={ref}
          className={styles}
          onChangeText={handleTextChange}
          secureTextEntry={showPassword}
          {...{ placeholder: !placeholderAnimation ? placeholder : undefined }}
          {...rest}
        />

        {error && (
          <AnimatedText
            className={errorText()}
            entering={FadeIn}
            exiting={FadeOut}
          >
            {error}
          </AnimatedText>
        )}

        {placeholder && placeholderAnimation && (
          <AnimatedText
            className="absolute px-4 text-white dark:text-white"
            style={animation}
          >
            {placeholder}
          </AnimatedText>
        )}

        {password && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={toggleShowPassword}
            className={rightIconStyle}
          >
            {showPassword ? (
              <MaterialCommunityIcons
                name="eye-off"
                color={colors.gray}
                size={25}
              />
            ) : (
              <MaterialCommunityIcons
                name="eye"
                color={colors.gray}
                size={25}
              />
            )}
          </TouchableOpacity>
        )}

        {options && (
          <TouchableOpacity activeOpacity={0.7} className={rightIconStyle}>
            <MaterialCommunityIcons
              name="chevron-down"
              color="#ebebf599"
              size={30}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

export type RuleType<T extends FieldValues> = { [name in keyof T]: TRule<T> };
export interface InputControllerType<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
}

interface ControlledInputProps<T extends FieldValues>
  extends TextInputProps,
    InputControllerType<T> {}

export function ControlledTextInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });

  return (
    <TextInput
      ref={field.ref}
      onChangeText={field.onChange}
      value={(field.value as string) || ''}
      error={fieldState.error?.message}
      {...inputProps}
    />
  );
}

export default TextInput;
