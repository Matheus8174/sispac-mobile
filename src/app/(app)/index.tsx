import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, {
  Callout,
  MapMarker,
  Marker,
  PROVIDER_GOOGLE
} from 'react-native-maps';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

import { getOccurrencesByCityAndState } from '@/api/fogo-cruzado';
import { FogoCruzadoOccurrences } from '@/api/types';
import StatesPicker, { StatesPickerData, StatesPickerRef } from '@/ui/picker';
import SearchBox from '@/ui/search-box';
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import colors from '@/ui/colors';

import Text from '@/ui/text';
import useOccurencies from '@/core/hooks/use-occurencies';

const states = [
  {
    id: 'b112ffbe-17b3-4ad0-8f2a-2038745d1d14',
    name: 'Rio de Janeiro',
    coordinates: {
      latitude: -22.9068,
      longitude: -43.1729
    }
  },
  {
    id: '813ca36b-91e3-4a18-b408-60b27a1942ef',
    name: 'Pernambuco',
    coordinates: {
      latitude: -8.0476,
      longitude: -34.877
    }
  },
  {
    id: 'd3a9b545-7056-4dc6-9b68-ce320c9edffc',
    name: 'Bahia',
    coordinates: {
      latitude: -12.9714,
      longitude: -38.5014
    }
  },
  {
    id: '2a98a020-3815-45d7-a6f6-6de2119eba8b',
    name: 'Pará',
    coordinates: {
      latitude: -1.4558,
      longitude: -48.5044
    }
  }
];

type OccurrenceItemProps = {
  title: string;
  location: string;
  date: string;
};

function OccurrenceItem({ title, date, location }: OccurrenceItemProps) {
  return (
    <View className="w-full flex-row gap-4 rounded-lg bg-black-100 p-4">
      <View className="aspect-square size-16 self-center rounded-full bg-blue-100" />

      <View className="flex-1 gap-4">
        <View className="flex-row justify-between">
          <Text variant="h3" numberOfLines={1} lineBreakMode="tail">
            {title}
          </Text>
          <Text
            variant="paragraph"
            className="!text-[#ebebf599]"
            numberOfLines={1}
            lineBreakMode="tail"
          >
            {Intl.DateTimeFormat('pt-br', { dateStyle: 'short' }).format(
              new Date(date)
            )}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text
            variant="paragraph"
            className="max-w-56 !text-[#ebebf599]"
            numberOfLines={1}
            lineBreakMode="tail"
          >
            {location}
          </Text>

          <Text className="rounded-full bg-red-100 px-3 py-1 font-bold">
            perigoso
          </Text>
        </View>
      </View>
    </View>
  );
}

const brazil = {
  latitude: -12.235,
  longitude: -50.9253,
  latitudeDelta: 40,
  longitudeDelta: 40
};

function Map() {
  const [state, setState] = React.useState<(typeof states)[0]>();

  const mapRef = React.useRef<MapView>(null);

  const pickerRef = React.useRef<StatesPickerRef>(null);

  const params = useLocalSearchParams<{ cityId?: string }>();

  const { getOccurrences, occurencies, isOccurenciesLoading } =
    useOccurencies();

  React.useEffect(() => {
    if (params.cityId && state?.id) exec();

    async function exec() {
      const [data] = await getOccurrences({
        stateId: state?.id!,
        cityId: params.cityId
      });

      mapRef.current?.animateToRegion({
        longitude: Number(data.longitude),
        latitude: Number(data.latitude),
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      });
    }
  }, [params.cityId]);

  React.useEffect(() => {
    if (state) exec();

    async function exec() {
      await getOccurrences({ stateId: state?.id! });

      mapRef.current?.animateToRegion({
        ...state!.coordinates,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      });
    }
  }, [state?.id]);

  const offsetY = useSharedValue(0);

  const snapPoints = React.useMemo(() => ['25%', '50%', '70%'], []);

  const animateButton = React.useCallback(
    (y: number) => (offsetY.value = withSpring(y, { mass: 0.6 })),
    []
  );

  const animatedButtonStyle = useAnimatedStyle(() => {
    const bottom = interpolate(
      offsetY.value,
      snapPoints.map((_, i) => i),
      [27, 52, 72]
    );

    return {
      bottom: `${bottom}%`
    };
  });

  function goToSearchView() {
    if (state?.id)
      router.push({
        pathname: '/search-map-city',
        params: {
          stateName: state.name,
          stateId: state.id
        }
      });

    pickerRef.current?.setShowPicker(true);
  }

  return (
    <View className="flex-1">
      <View
        className="flex-1"
        onTouchStart={() => pickerRef.current?.setShowPicker(false)}
      >
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={brazil}
          showsCompass={false}
          provider={PROVIDER_GOOGLE}
        >
          {occurencies &&
            occurencies.map(({ longitude, latitude, id, ...rest }) => (
              <Marker
                key={id}
                pinColor={colors.blue[100]}
                coordinate={{
                  latitude: Number(latitude),
                  longitude: Number(longitude)
                }}
              >
                <Callout
                  onPress={() => {}}
                  tooltip
                  style={{
                    flex: -1,
                    maxWidth: 300,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <View className="flex-1 gap-4 justify-around p-3 bg-black-200 rounded-lg">
                    <Text className="font-bold" numberOfLines={1}>
                      {rest.contextInfo.mainReason.name}
                    </Text>

                    <Text numberOfLines={1} variant="subtitle">
                      {Intl.DateTimeFormat('pt-br', {
                        dateStyle: 'medium'
                      }).format(new Date(rest.date))}
                    </Text>

                    <Text numberOfLines={2} variant="subtitle">
                      {rest.address}
                    </Text>

                    <Text
                      variant="subtitle"
                      className="underline !text-blue-100"
                    >
                      ver mais
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
        </MapView>

        <BottomSheet
          index={1}
          onChange={animateButton}
          overDragResistanceFactor={0}
          style={{ flex: 1 }}
          backgroundStyle={{ backgroundColor: colors.black['50'] }}
          snapPoints={snapPoints}
        >
          <View className="flex-1 overflow-visible bg-black-200">
            <View className="flex-row items-center gap-6 bg-black-50 px-4 pb-4">
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-1"
                onPress={goToSearchView}
              >
                <SearchBox
                  editable={false}
                  focusable={false}
                  placeholder="Digite uma cidade:"
                />
              </TouchableOpacity>

              <View className="aspect-square items-center justify-center overflow-hidden rounded-full bg-[#ebebf599] p-2">
                <Feather name="user" color="#FFF" size={30} />
              </View>
            </View>
            <View className="flex-1 gap-4 px-4 pt-4">
              <Text variant="h3">Ocorrências Recentes</Text>

              {occurencies.length <= 0 ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => pickerRef.current?.setShowPicker(true)}
                >
                  <Text className="underline">
                    Selecione algum Estado para ver as suas ultímas ocorrencias
                  </Text>
                </TouchableOpacity>
              ) : (
                <BottomSheetScrollView contentContainerStyle={{ gap: 10 }}>
                  {occurencies.map(({ id, address, contextInfo, date }, i) => (
                    <OccurrenceItem
                      key={id + date + i}
                      location={address}
                      title={contextInfo.mainReason.name}
                      date={date}
                    />
                  ))}
                </BottomSheetScrollView>
              )}
            </View>
          </View>
        </BottomSheet>
      </View>

      <Animated.View
        style={[{ position: 'absolute', right: 16 }, animatedButtonStyle]}
      >
        <StatesPicker
          data={states}
          onChange={(e) => setState(e)}
          ref={pickerRef}
        />
      </Animated.View>

      {isOccurenciesLoading && (
        <View className="absolute flex-row right-4 top-4 self-end gap-4 justify-center items-center">
          <ActivityIndicator size="small" color={colors.black[200]} />

          <Text variant="h4" className="!text-black-200">
            Carregando ocorrencias
          </Text>
        </View>
      )}
    </View>
  );
}

export default Map;
