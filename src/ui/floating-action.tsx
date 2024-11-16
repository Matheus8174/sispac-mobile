import { PropsWithChildren } from 'react';
import { TouchableOpacity } from 'react-native';
import { TouchableOpacityProps } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withRepeat
} from 'react-native-reanimated';

const Button = Animated.createAnimatedComponent(TouchableOpacity);

function FloatAction({
  children,
  onPress,
  ...rest
}: PropsWithChildren<TouchableOpacityProps>) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Button
      onPress={(e) => {
        // scale.value = withRepeat(
        //   withSpring(1.5, {
        //     duration: 400,
        //     dampingRatio: 0.2
        //   }),
        //   2,
        //   true
        // );

        if (onPress) onPress(e);
      }}
      style={style}
      className="justify-center items-center absolute bottom-10 right-7 rounded-full bg-black-50 p-4"
      {...rest}
    >
      {children}
    </Button>
  );
}

export default FloatAction;
