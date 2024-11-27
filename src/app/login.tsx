import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import Button from '@/ui/button';
import Text from '@/ui/text';
import { ControlledTextInput } from '@/ui/text-input';
import { authUser } from '@/api/app';
import { AxiosError } from 'axios';
import { useAuth } from '@/core/auth';

const schema = z.object({
  email: z
    .string({
      required_error: 'digite o seu e-mail'
    })
    .email('formato de e-mail invalido'),
  password: z
    .string({
      required_error: 'digite sua senha'
    })
    .min(6, 'a senha precisa ter ao menos 6 caracteres')
});

type AuthUserForm = z.infer<typeof schema>;

function Home() {
  const { signIn } = useAuth();

  const { handleSubmit, control, setError } = useForm<AuthUserForm>({
    resolver: zodResolver(schema)
  });

  const router = useRouter();

  async function handleFormSubmit(data: AuthUserForm) {
    try {
      const {
        data: { accessToken, id }
      } = await authUser(data);

      if (!accessToken) throw new Error('accessToken não existe');

      await signIn({ accessToken, refreshToken: '', userId: id });

      router.push('/(app)/');
    } catch (err) {
      const { response } = err as AxiosError<{ message: string }>;

      console.log('eeerro', response);

      if (response?.data)
        setError('password', { message: response.data.message });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 justify-around px-7 py-10">
        <Text variant="h3" className="max-w-96 font-normal">
          Faça Login para aproveitar a melhor plataforma de segurança:
        </Text>

        <View className="gap-14">
          <ControlledTextInput
            control={control}
            name="email"
            placeholder="Seu e-mail:"
            autoCapitalize="none"
            placeholderAnimation
            keyboardType="email-address"
          />

          <ControlledTextInput
            control={control}
            name="password"
            placeholder="Sua senha:"
            autoCapitalize="none"
            placeholderAnimation
            password
            variant="outlined"
          />

          <View className="flex w-full gap-12">
            <Button.Root onPress={handleSubmit(handleFormSubmit)}>
              <Button.Text>Log in</Button.Text>
            </Button.Root>

            <Link href="/forget-password" className="self-center">
              <Text variant="paragraph" className="underline">
                Esqueceu sua senha?
              </Text>
            </Link>
          </View>
        </View>

        <Button.Root
          variant="outlined"
          onPress={() => router.push('/register')}
        >
          <Button.Text className="text-white">Criar uma nova conta</Button.Text>
        </Button.Root>
      </View>
    </SafeAreaView>
  );
}

export default Home;
