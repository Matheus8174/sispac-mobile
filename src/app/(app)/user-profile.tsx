import React from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
// import { Image } from 'expo-image';

import Text from '@/ui/text';
import colors from '@/ui/colors';
import TextInput from '@/ui/text-input';
import FormControl from '@/ui/form-control';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  baseURL,
  getUserAuthenticated,
  getUserAvatar,
  uploadUserAvatar
} from '@/api/app';
import { User } from '@/api/types';
import { useAuth } from '@/core/auth';
import Image, { ImageRef } from '@/ui/Image';

function UserProfile() {
  const [user, setUser] = React.useState<User>();

  const { token } = useAuth();

  const imageRef = React.useRef<ImageRef>(null);

  const snapPoints = React.useMemo(() => ['25%'], []);

  const bottomSheetRef = React.useRef<BottomSheetMethods>(null);

  const handleImageChange = () => bottomSheetRef.current?.expand();

  async function handleAvatarUpdate() {
    const permission = await ImagePicker.getCameraPermissionsAsync();

    if (!permission.granted) {
      await ImagePicker.requestCameraPermissionsAsync();
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (result.canceled) return;

    const userAvatar = result.assets[0];

    uploadUserAvatar('avatar', userAvatar).then((e) => {
      imageRef.current?.update();
    });
  }

  React.useEffect(() => {
    getUserAuthenticated().then((user) => {
      setUser(user.data);
    });
  }, []);

  return (
    <View className="flex-1">
      <View
        className="justify-center px-7 pt-5 gap-10"
        onTouchStart={() => bottomSheetRef.current?.close()}
      >
        <View className="p-2 rounded-full border border-blue-100 self-center relative">
          <Image
            ref={imageRef}
            cachePolicy={'none'}
            className="size-[135] rounded-full"
            placeholder={require('@/assets/person.svg')}
            source={{
              uri: `${baseURL}/files/avatar`,
              headers: {
                Authorization: 'Bearer ' + token?.accessToken
              }
            }}
          />

          <TouchableOpacity
            onPress={handleImageChange}
            activeOpacity={0.7}
            className="absolute right-0 bottom-0 -m-2 rounded-full p-2 bg-blue-100 items-center justify-center"
          >
            <MaterialIcons
              name="camera-alt"
              size={30}
              color={colors.black['50']}
            />
          </TouchableOpacity>
        </View>

        <FormControl.Root>
          <FormControl.Label>Nome:</FormControl.Label>

          <TextInput variant="outlined-gray" placeholder={user?.name} />
        </FormControl.Root>

        <FormControl.Root>
          <FormControl.Label>E-mail:</FormControl.Label>

          <TextInput
            variant="outlined-gray"
            placeholder={user?.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </FormControl.Root>

        <FormControl.Root>
          <FormControl.Label>Localização:</FormControl.Label>

          <TextInput
            variant="outlined-gray"
            placeholder="Rua pedro Jão Longo"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </FormControl.Root>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-md flex-row items-center gap-4 bg-black-100 px-4 py-3"
        >
          <MaterialIcons name="logout" size={30} color={colors.red[100]} />
          <Text variant="h4">Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-md flex-row items-center gap-4 bg-black-100 px-4 py-3"
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={30}
            color={colors.red[100]}
          />
          <Text variant="h4">Apagar conta</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.black['50'] }}
        snapPoints={snapPoints}
      >
        <View className="flex-1 p-4 items-start flex-row gap-5">
          <TouchableOpacity
            activeOpacity={0.7}
            className="border-2 border-blue-100 px-4 py-2 rounded-2xl items-center justify-center"
          >
            <MaterialIcons
              name="camera-alt"
              size={25}
              color={colors.blue[100]}
            />

            <Text>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleAvatarUpdate}
            className="border-2 border-blue-100 px-4 py-2 rounded-2xl items-center justify-center"
          >
            <MaterialIcons name="image" size={25} color={colors.blue[100]} />

            <Text>Galeria</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

export default UserProfile;
