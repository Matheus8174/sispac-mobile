import React from 'react';
import { View } from 'react-native';
import Checkbox from 'expo-checkbox';
import { appApi, createUser, listAllUsers, uploadUserAvatar } from '@/api/app';
import { useThemeConfig } from '@/core/hooks/use-theme-config';
import { zodResolver } from '@hookform/resolvers/zod';

import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

import { z } from 'zod';

import Button from '@/ui/button';
import Text from '@/ui/text';
import { ControlledTextInput } from '@/ui/text-input';
import ImageUpload, { ImageUploadRef } from '@/ui/image-upload';

const schema = z
  .object({
    name: z
      .string()
      .min(6, 'o nome precisa ter ao menos 6 caracteres')
      .default(''),
    email: z
      .string({
        required_error: 'digite o seu e-mail'
      })
      .email('formato de e-mail invalido'),
    password: z
      .string({
        required_error: 'digite sua senha'
      })
      .min(6, 'a senha precisa ter ao menos 6 caracteres'),
    confirmPassword: z.string({
      required_error: 'confirme a senha'
    }),
    terms: z
      .boolean({ required_error: 'você precisa aceitar os termos primeiro' })
      .default(false)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'as senhas não combinam',
    path: ['confirmPassword']
  });

type CreateUserForm = z.infer<typeof schema>;

function Register() {
  const [profileImage, setProfileImage] =
    React.useState<ImagePicker.ImagePickerAsset>();

  const pickerRef = React.useRef<ImageUploadRef>(null);

  const { handleSubmit, control, watch } = useForm<CreateUserForm>({
    resolver: zodResolver(schema)
  });

  const theme = useThemeConfig();

  const isTermsAccepted = watch('terms');

  async function handleFormSubmit(data: CreateUserForm) {
    if (!profileImage) return;

    await createUser(data);

    await uploadUserAvatar('avatar', profileImage);

    router.navigate('/(app)');
  }

  async function handleProfileImage() {
    const permission = await ImagePicker.getCameraPermissionsAsync();

    if (!permission.granted) {
      await ImagePicker.requestCameraPermissionsAsync();
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      selectionLimit: 1,
      allowsEditing: true,
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (result.canceled) return;

    pickerRef.current?.setAmountFiles(result.assets.length);

    setProfileImage(result.assets[0]);
  }

  return (
    <View className="flex-1 px-7 py-10">
      <View className="mt-10 flex-1 gap-14">
        <ControlledTextInput
          variant="outlined"
          name="name"
          control={control}
          placeholder="Nome de usuário:"
        />

        <ControlledTextInput
          control={control}
          name="email"
          variant="outlined"
          placeholder="Seu e-mail:"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <ControlledTextInput
          name="password"
          control={control}
          placeholder="Sua senha:"
          autoCapitalize="none"
          password
          variant="outlined"
        />

        <ControlledTextInput
          name="confirmPassword"
          control={control}
          placeholder="Confirme sua senha:"
          autoCapitalize="none"
          password
          variant="outlined"
        />

        <View className="h-40">
          <ImageUpload
            ref={pickerRef}
            text="escolha uma imagem de perfil"
            onPress={handleProfileImage}
          />
        </View>

        <View>
          <Button.Root
            variant="contained"
            onPress={handleSubmit(handleFormSubmit)}
            disabled={!isTermsAccepted}
          >
            <Button.Text>Criar uma nova conta</Button.Text>
          </Button.Root>
        </View>

        <View className="flex-row items-center gap-4 self-center">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox
                testID="terms-checkbox"
                value={field.value}
                color={theme.colors.primary}
                onValueChange={field.onChange}
              />
            )}
          />

          <Text className="text-gray">Eu aceito os termos de serviço</Text>
        </View>
      </View>
    </View>
  );
}

export default Register;
