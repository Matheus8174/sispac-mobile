import React from 'react';
import { FlatList, TextInput as RNTextInput, View } from 'react-native';

import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Text from '@/ui/text';
import colors from '@/ui/colors';
import Button from '@/ui/button';
import TextInput, { ControlledTextInput } from '@/ui/text-input';
import FormControl from '@/ui/form-control';
import { useThemeConfig } from '@/core/hooks/use-theme-config';

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Municipio } from './(app)/forum';
import axios from 'axios';
import clsx from 'clsx';
import Animated from 'react-native-reanimated';

const tags = [
  'Ação policial',
  'Arrastão',
  'Ataque a civis',
  'Briga',
  'Homicídio/Tentativa'
];

const schema = z.object({
  subject: z.string().min(6, 'O assunto precisa ter ao menos 6 caracteres'),
  city: z.string(),
  tag: z
    .array(z.string())
    .default([])
    .refine((userTags) => userTags.find((e) => tags.find((a) => e === a)), {
      message: 'Essa tag não existe'
    })
});

type CreateForumForm = z.infer<typeof schema>;

function CreateForum() {
  const theme = useThemeConfig();

  const { handleSubmit, control, setValue, watch } = useForm<CreateForumForm>({
    resolver: zodResolver(schema),
    defaultValues: { tag: [] }
  });

  const userTag = watch('tag');

  const city = watch('city');

  // const [cityComplement, setCityComplement] = React.useState('');

  const [citysFiltered, setCitysFiltered] = React.useState<Municipio[]>([]);

  const [allCitys, setAllCitys] = React.useState<Municipio[]>([]);

  const snapPoints = React.useMemo(() => ['50%'], []);

  const bottomSheetRef = React.useRef<BottomSheetMethods>(null);

  async function handleFormSubmit(data: CreateForumForm) {
    console.log(data);
  }

  React.useEffect(() => {
    if (allCitys.length >= 1) return;

    axios
      .get<
        Municipio[]
      >('https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
      .then((response) => {
        setAllCitys(response.data);
      });
  }, []);

  React.useEffect(() => {
    setCitysFiltered(allCitys.filter(({ nome }) => nome.includes(city)));
  }, [city]);

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
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <View className="relative">
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    placeholder="Tópico referente a qual cidade"
                    variant="outlined-gray"
                    className="h-14"
                  />
                </View>
              )}
            />
          </FormControl.Root>
          {citysFiltered.length > 0 && (
            <View className="max-w-96 overflow-hidden z-10 h-52 translate-y-full absolute bottom-0 ">
              <FlatList
                style={{ flex: 1 }}
                ItemSeparatorComponent={() => (
                  <View className="h-[1px] w-full bg-black-200 my-4" />
                )}
                contentContainerClassName="bg-black-100 p-4 rounded-lg"
                data={citysFiltered.slice(0, 4)}
                renderItem={({ item: { nome, id } }) => (
                  <TouchableOpacity key={id}>
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
            name="tag"
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
          <FormControl.Label>Conteudo:</FormControl.Label>
          <TextInput
            placeholder="Conteudo"
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

          <Button.Root onPress={handleSubmit(handleFormSubmit)}>
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
            const isSelected = !!userTag.find((e) => e === tag);

            return (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.7}
                onPress={() => {
                  if (isSelected) {
                    const data = userTag.filter((e) => e !== tag);

                    return setValue('tag', data);
                  }

                  setValue('tag', [...userTag, tag]);
                }}
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
