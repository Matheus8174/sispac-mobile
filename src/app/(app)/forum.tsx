import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';

import Text from '@/ui/text';
import SearchBox from '@/ui/search-box';
import Button from '@/ui/button';
import { useThemeConfig } from '@/core/hooks/use-theme-config';
import FloatAction from '@/ui/floating-action';

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

function Forum() {
  const theme = useThemeConfig();

  const [allCitys, setAllCitys] = React.useState<Municipio[]>([]);

  const [selectCityFocus, setSelectCityFocus] = React.useState(true);

  const [citysFiltered, setCitysFiltered] = React.useState<Municipio[]>([]);

  const getForumByCity = React.useCallback(() => {}, []);

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

  return (
    <View className="flex-1 px-7 pt-10 gap-10 relative">
      <Text variant="h2">Foruns de discussão</Text>

      <View className="p-4 bg-black-100 rounded-lg -mx-4 gap-4">
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
              placeholder="Escolha uma cidade"
              onChangeText={(text) => {
                setCitysFiltered(
                  allCitys.filter(({ nome }) =>
                    nome.toLowerCase().includes(text.toLowerCase())
                  )
                );
              }}
            />
          </View>
          <Button.Root className="px-5 rounded-lg">
            <Button.Text>Buscar</Button.Text>
          </Button.Root>
        </View>
      </View>

      {selectCityFocus && (
        <FlatList
          data={citysFiltered}
          keyExtractor={({ id }) => id.toString()}
          contentContainerStyle={{ gap: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.7}>
              <View className="flex-row gap-4 items-center">
                <FontAwesome6
                  name="location-dot"
                  size={20}
                  color={theme.colors.primary}
                />

                <Text variant="h3">{item.nome}</Text>
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
