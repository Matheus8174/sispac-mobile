import React from 'react';
import { FlatList, View } from 'react-native';

import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Text from '@/ui/text';
import colors from '@/ui/colors';
import Button from '@/ui/button';
import TextInput, { ControlledTextInput } from '@/ui/text-input';
import FormControl from '@/ui/form-control';
import { useThemeConfig } from '@/core/hooks/use-theme-config';

import BottomSheet from '@gorhom/bottom-sheet';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { allCitys, type Municipio } from './(app)/forums';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import { createForum } from '@/api/app';
import { useAuth } from '@/core/auth';

const tags = [
  'Ação policial',
  'Arrastão',
  'Ataque a civis',
  'Briga',
  'Homicídio/Tentativa'
];

const schema = z.object({
  subject: z.string().min(6, 'O assunto precisa ter ao menos 6 caracteres'),
  city: z.object({
    id: z.string(),
    name: z
      .string()
      .refine(
        (city) => !!allCitys.find(({ nome }) => nome === city),
        'Essa cidade não existe ou não foi cadastrada'
      )
  }),
  tags: z
    .array(z.string())
    .default([])
    .refine(
      (userTags) =>
        userTags.length > 0
          ? userTags.find((e) => tags.find((a) => e === a))
          : true,
      {
        message: 'Essa tag não existe'
      }
    ),
  content: z.string().min(6, 'O conteúdo precisa ter ao menos 6 caracteres')
});

export type CreateForumForm = z.infer<typeof schema>;

function CreateForum() {
  const theme = useThemeConfig();

  const { handleSubmit, control, setValue, watch, setError } =
    useForm<CreateForumForm>({
      resolver: zodResolver(schema),
      defaultValues: {
        tags: [],
        city: { name: '', id: '' }
      }
    });

  const userTag = watch('tags');

  const city = watch('city');

  const [citysFiltered, setCitysFiltered] = React.useState<Municipio[]>([]);

  const snapPoints = React.useMemo(() => ['50%'], []);

  const bottomSheetRef = React.useRef<BottomSheetMethods>(null);

  const shouldShowCitysOptions =
    citysFiltered.length > 0 && citysFiltered[0].nome !== city.name;

  async function handleFormSubmit({ city, ...rest }: CreateForumForm) {
    try {
      await createForum({ ...rest, cityId: city.id });

      router.back();
    } catch (err) {
      const { response } = err as AxiosError<{ message: string }>;

      if (response?.data.message === 'city not exists') {
        setError('city', { message: 'Essa cidade não existe' });
      }
    }
  }

  const handleTagPress = React.useCallback(
    (tag: string, isSelected: boolean) => {
      if (isSelected) {
        const data = userTag.filter((e) => e !== tag);

        return setValue('tags', data);
      }

      setValue('tags', [...userTag, tag]);
    },
    [userTag, setValue]
  );

  const updateCity = React.useCallback(
    ({ nome, id }: { nome: string; id: number | string }) => {
      setValue('city', {
        name: nome,
        id: id.toString()
      });
    },
    []
  );

  React.useEffect(() => {
    if (!city.name) return;

    setCitysFiltered(allCitys.filter(({ nome }) => nome.includes(city.name)));
  }, [city.name]);

  return (
    <View className="flex-1">
      <View
        className="flex-1 px-7 pt-10 gap-10"
        onTouchStart={() => bottomSheetRef.current?.close()}
      >
        <View className="flex-row gap-4">
          <MaterialCommunityIcons
            size={30}
            name="arrow-left"
            onPress={router.back}
            color={theme.colors.notification}
          />
          <Text variant="h2">Criar novo forum</Text>
        </View>

        <FormControl.Root>
          <FormControl.Label>Assunto:</FormControl.Label>
          <ControlledTextInput
            name="subject"
            control={control}
            placeholder="Titulo do tópico"
            variant="outlined-gray"
            className="h-14"
          />
        </FormControl.Root>
        <View className="relative">
          <FormControl.Root>
            <FormControl.Label>Cidade:</FormControl.Label>

            <View className="relative">
              <Controller
                control={control}
                name="city"
                render={({ field, fieldState }) => (
                  <TextInput
                    onChangeText={(t) =>
                      field.onChange({ id: city.id, name: t })
                    }
                    value={field.value.name}
                    //@ts-expect-error name exists
                    error={fieldState.error?.name?.message}
                    onSubmitEditing={() => {
                      const { id, nome } = citysFiltered[0];

                      if (id) updateCity({ id, nome });
                    }}
                    onBlur={() => setCitysFiltered([])}
                    placeholder="Tópico referente a qual cidade"
                    variant="outlined-gray"
                    autoCapitalize="words"
                    className="h-14"
                  />
                )}
              />
            </View>
          </FormControl.Root>
          {shouldShowCitysOptions && (
            <View className="max-w-96 rounded-lg overflow-hidden z-10 h-52 translate-y-full absolute bottom-0">
              <FlatList
                style={{ flex: 1 }}
                ItemSeparatorComponent={() => (
                  <View className="h-[1px] w-full bg-black-200 my-4" />
                )}
                contentContainerClassName="bg-black-100 p-4"
                data={citysFiltered.slice(0, 4)}
                renderItem={({ item: { nome, id } }) => (
                  <TouchableOpacity
                    key={id}
                    onPress={() => updateCity({ nome, id })}
                  >
                    <Text>{nome}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <FormControl.Root onTouchStart={() => bottomSheetRef.current?.expand()}>
          <FormControl.Label>Tags:</FormControl.Label>

          <Controller
            name="tags"
            control={control}
            render={({ field, fieldState }) => (
              <TextInput
                error={fieldState.error?.message}
                value={field.value?.join(', ')}
                options
                variant="outlined-gray"
                editable={false}
                className="h-14"
                placeholder="Escolha algumas tags"
              />
            )}
          />
        </FormControl.Root>
        <FormControl.Root>
          <FormControl.Label>Conteúdo:</FormControl.Label>
          <ControlledTextInput
            name="content"
            control={control}
            placeholder="Conteúdo"
            variant="outlined-gray"
            textAlignVertical="top"
            className="h-40"
          />
        </FormControl.Root>

        <View className="flex-row gap-5 self-end">
          <Button.Root
            variant="contained"
            className="bg-red-300"
            onPress={() => router.back()}
          >
            <Button.Text>Cancelar</Button.Text>
          </Button.Root>

          <Button.Root
            onPress={handleSubmit(handleFormSubmit, (err) => {
              console.log('ssss: ', err);
            })}
          >
            <Button.Text>Criar tópico</Button.Text>
          </Button.Root>
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        style={{ flex: 1 }}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colors.black['50'] }}
        enablePanDownToClose
      >
        <View className="px-7 pt-7 gap-8 flex-1 flex-row flex-wrap">
          {tags.map((tag) => {
            const isSelected = userTag.includes(tag);

            return (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.7}
                onPress={() => handleTagPress(tag, isSelected)}
              >
                <View
                  className={clsx(
                    'px-4 border-white py-2 rounded-full border-2 items-center justify-center',
                    {
                      '!border-blue-100': isSelected
                    }
                  )}
                >
                  <Text
                    variant="h4"
                    className={clsx({
                      '!text-blue-100': isSelected
                    })}
                  >
                    {tag}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

export default CreateForum;
