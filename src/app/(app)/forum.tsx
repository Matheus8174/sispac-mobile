import React from 'react';
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import axios from 'axios';

import * as Location from 'expo-location';

import Text from '@/ui/text';
import SearchBox from '@/ui/search-box';
import Button from '@/ui/button';
import { useThemeConfig } from '@/core/hooks/use-theme-config';
import FloatAction from '@/ui/floating-action';
import { getForumsByCity } from '@/api/app';
import { GetForumsByCity } from '@/api/types';

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

  // const [location, setLocation] = React.useState<string | null>(null);

  const [city, setCity] = React.useState('');

  const cityTextInput = React.useRef<TextInput>(null);

  // const [allCitys, setAllCitys] = React.useState<Municipio[]>([]);

  const [selectCityFocus, setSelectCityFocus] = React.useState(true);

  const [citysFiltered, setCitysFiltered] = React.useState<Municipio[]>([]);

  const [forums, setForums] = React.useState<GetForumsByCity[]>([]);

  const getForumByCity = async (cityId: string) => {
    console.log(cityId);
    const response = await getForumsByCity(cityId);

    console.log(response.data);

    setForums(response.data);
  };

  React.useEffect(() => {}, [citysFiltered]);

  React.useEffect(() => {
    async function getCurrentLocation() {
      await Location.requestForegroundPermissionsAsync();

      const location = await Location.getCurrentPositionAsync();

      const [address] = await Location.reverseGeocodeAsync(location.coords);

      const cityLocation = address.city || address.subregion;

      // if (cityLocation) setCity(cityLocation);
    }

    getCurrentLocation();
  }, []);

  return (
    <View className="flex-1 px-7 pt-10 relative">
      <Text variant="h2">Foruns de discussão</Text>

      <View className="p-4 bg-black-100 rounded-lg -mx-4 gap-4 mt-10">
        <View className="h-14">
          <SearchBox
            placeholder="Buscar forum:"
            onFocus={() => setSelectCityFocus(false)}
          />
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 h-14">
            <SearchBox
              onFocus={() => setSelectCityFocus(true)}
              onBlur={() => setSelectCityFocus(false)}
              placeholder="Escolha uma cidade"
              ref={cityTextInput}
              autoCapitalize="words"
              value={city}
              onChangeText={(text) => {
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
            onPress={() => {
              if (cityTextInput?.current?.blur) cityTextInput?.current?.blur();

              const cityId = allCitys
                .find(({ nome }) => nome === citysFiltered[0].nome)
                ?.id.toString();

              if (!cityId) return;

              getForumByCity(cityId);
            }}
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
              onPress={() => {
                // cityTextInput.current?.blur();

                getForumByCity(item.id.toString());

                setSelectCityFocus(false);
              }}
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
                <Text>
                  Parece que ainda nimguém criou um forum em{' '}
                  <Text className="!text-blue-100">
                    {citysFiltered[0].nome}
                  </Text>
                  , <Text className="underline">que tal ser o primeiro!?</Text>
                </Text>
              </Link>
            </View>
          )}
          keyExtractor={({ id }) => id.toString()}
          contentContainerClassName="pt-2"
          contentContainerStyle={{ gap: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.7}>
              <View className="flex-row gap-4 items-center">
                <Text variant="h3">{item.subject}</Text>
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
