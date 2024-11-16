import React from 'react';
import { View } from 'react-native';

import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Text from '@/ui/text';
import Button from '@/ui/button';
import { ControlledTextInput } from '@/ui/text-input';
import ImageUpload, { ImageUploadRef } from '@/ui/image-upload';
import { createComplaint, uploadComplaintImage } from '@/api/app';
import FormControl from '@/ui/form-control';

const schema = z.object({
  location: z.string().min(7, { message: 'localização muito pequena' }),
  detail: z
    .string({ required_error: 'forneça detales sobre a denuncia' })
    .min(10, { message: 'forneça mais detales sobre a denuncia' })
});

type CreateComplaintForm = z.infer<typeof schema>;

function Complaint() {
  const { handleSubmit, control } = useForm<CreateComplaintForm>({
    resolver: zodResolver(schema)
  });

  const [images, setImages] = React.useState<ImagePicker.ImagePickerAsset[]>();

  const pickerRef = React.useRef<ImageUploadRef>(null);

  async function handleFormSubmit(data: CreateComplaintForm) {
    if (!images) return;

    const response = await createComplaint(data);

    await uploadComplaintImage('images', images, response.data.id);
  }

  async function pickImage() {
    const permission = await ImagePicker.getCameraPermissionsAsync();

    if (!permission.granted) {
      await ImagePicker.requestCameraPermissionsAsync();
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      selectionLimit: 6,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (result.canceled) return;

    pickerRef.current?.setAmountFiles(result.assets.length);

    setImages(result.assets);
  }

  return (
    <View className="px-7 pt-10 pb-5 gap-12">
      <Text variant="h2" onPress={() => router.push('/login')}>
        Formulário de denuncia
      </Text>

      <FormControl.Root>
        <FormControl.Label>Localização:</FormControl.Label>

        <ControlledTextInput
          name="location"
          control={control}
          variant="outlined-gray"
          placeholder="local onde ocorreu o crime"
        />
      </FormControl.Root>

      <FormControl.Root>
        <FormControl.Label>Detales:</FormControl.Label>

        <ControlledTextInput
          name="detail"
          control={control}
          placeholder="de mais informações sobre a denuncia"
          variant="outlined-gray"
          className="h-40"
          textAlignVertical="top"
        />
      </FormControl.Root>

      <View className="h-40">
        <ImageUpload onPress={pickImage} ref={pickerRef} />
      </View>

      <Button.Root onPress={handleSubmit(handleFormSubmit)}>
        <Button.Text>Enviar</Button.Text>
      </Button.Root>
    </View>
  );
}

export default Complaint;
