import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  TextInput as RNTextInput
} from 'react-native';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';

import * as Location from 'expo-location';

import Text from '@/ui/text';
import SearchBox from '@/ui/search-box';
import Button from '@/ui/button';
import { useThemeConfig } from '@/core/hooks/use-theme-config';
import FloatAction from '@/ui/floating-action';
import { getForumsByCity } from '@/api/app';
import { GetForumsByCity } from '@/api/types';
import colors from '@/ui/colors';
import TextInput from '@/ui/text-input';

export type Municipio = {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
};

export let allCitys: Municipio[] = [];

axios
  .get<
    Municipio[]
  >('https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
  .then((response) => {
    allCitys = response.data;
  });

function Forum() {
  const theme = useThemeConfig();

  const router = useRouter();

  const [city, setCity] = React.useState('');

  const [selectCityFocus, setSelectCityFocus] = React.useState(true);

  const [citysFiltered, setCitysFiltered] = React.useState<Municipio[]>([]);

  const [forums, setForums] = React.useState<GetForumsByCity[]>([]);

  const cityTextInput = React.useRef<RNTextInput>(null);

  const handleCityShown = async (municipio?: Municipio) => {
    const city =
      municipio ?? allCitys.find(({ nome }) => nome === citysFiltered[0].nome);

    if (!city) return;

    const { data } = await getForumsByCity(city.id);

    setCity(city.nome);

    setSelectCityFocus(false);

    setForums(data);

    cityTextInput.current?.blur();
  };

  React.useEffect(() => {
    async function getCurrentLocation() {
      await Location.requestForegroundPermissionsAsync();

      const location = await Location.getCurrentPositionAsync();

      const [address] = await Location.reverseGeocodeAsync(location.coords);

      const cityLocation = address.city || address.subregion;

      if (cityLocation) setCity(cityLocation);
    }

    getCurrentLocation();
  }, []);

  return (
    <View className="flex-1 px-7 pt-10 relative">
      <Text variant="h2">Foruns de discussão:</Text>

      <View className="p-4 bg-black-100 rounded-lg -mx-4 gap-4 mt-10">
        <View className="h-14">
          <SearchBox
            placeholder="Buscar forum:"
            onFocus={() => setSelectCityFocus(false)}
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 h-14">
            <TextInput
              ref={cityTextInput}
              variant="outlined-gray"
              options
              value={city}
              placeholder="Escolha uma cidade"
              autoCapitalize="words"
              className="rounded-lg"
              onSubmitEditing={() => handleCityShown()}
              onChangeText={(text) => {
                if (!selectCityFocus) setSelectCityFocus(true);

                setCitysFiltered(
                  allCitys.filter(({ nome }) =>
                    nome.toLowerCase().includes(text.toLowerCase())
                  )
                );

                setCity(text);
              }}
            />
          </View>
          <Button.Root
            className="px-5 rounded-lg"
            onPress={() => handleCityShown()}
          >
            <Button.Text>Buscar</Button.Text>
          </Button.Root>
        </View>
      </View>

      {selectCityFocus ? (
        <FlatList
          data={citysFiltered.slice(0, 10)}
          keyExtractor={({ id }) => id.toString()}
          contentContainerClassName="pt-2"
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              className="py-5"
              onPress={() => handleCityShown(item)}
            >
              <View className="flex-row gap-4 items-center">
                <FontAwesome6
                  name="location-dot"
                  size={20}
                  color={theme.colors.primary}
                />

                <Text variant="h4">{item.nome}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={forums}
          style={{ flex: 1 }}
          ListEmptyComponent={() => (
            <View className="self-center mt-[50%] mx-5">
              <Link href="/create-forum">
                <Text variant="h4" className="font-normal underline leading-6">
                  Parece que ainda nimguém criou um forum em{' '}
                  <Text className="!text-blue-100">{city ?? 'sua cidade'}</Text>
                  , que tal ser o primeiro!?
                </Text>
              </Link>
            </View>
          )}
          keyExtractor={({ id }) => id.toString()}
          className="-mx-4"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="pt-10 gap-10"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.navigate({
                  pathname: '/forum/[id]',
                  params: { id: item.id }
                })
              }
              activeOpacity={0.7}
              className="w-full p-5 gap-8 flex-row rounded-lg bg-black-100"
            >
              <MaterialCommunityIcons
                name="star"
                color={colors.orange[100]}
                size={50}
              />

              <View className="gap-8 flex-1 items-start">
                <Text variant="h2" numberOfLines={2}>
                  {item.subject}
                </Text>

                <View className="flex-row gap-4">
                  {item.tags.map(({ name }) => (
                    <View
                      className="bg-black-50 rounded-full justify-center items-center px-4 py-2"
                      key={name}
                    >
                      <Text className="font-semibold" variant="subtitle">
                        {name}
                      </Text>
                    </View>
                  ))}
                </View>

                <View>
                  <Text>{item.comments.length} Comentarios</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <FloatAction onPress={() => router.navigate('/create-forum')}>
        <MaterialCommunityIcons
          name="plus"
          size={35}
          color={theme.colors.primary}
        />
      </FloatAction>
    </View>
  );
}

export default Forum;
