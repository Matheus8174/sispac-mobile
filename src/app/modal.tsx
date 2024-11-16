import { View } from 'react-native';

import { router } from 'expo-router';

import Text from '@/ui/text';
import Button from '@/ui/button';
import TextInput from '@/ui/text-input';
import FormControl from '@/ui/form-control';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

function Modal() {
  return (
    <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
      <View
        className="absolute size-full"
        onTouchStart={() => router.dismiss()}
      />

      <View className="bg-black-50 p-6 rounded-lg max-w-[80%] gap-8">
        <Text variant="h2">Criar forum</Text>

        <View className="gap-4">
          <FormControl.Root>
            <FormControl.Label>Assunto:</FormControl.Label>
            <TextInput
              placeholder="Assunto"
              variant="outlined-gray"
              className="h-14"
            />
          </FormControl.Root>
          <FormControl.Root>
            <FormControl.Label>Conteudo:</FormControl.Label>
            <TextInput
              placeholder="Conteudo"
              variant="outlined-gray"
              className="h-14"
            />
          </FormControl.Root>
          <FormControl.Root>
            <FormControl.Label>Cidade:</FormControl.Label>
            <TextInput
              placeholder="Cidade"
              variant="outlined-gray"
              className="h-14"
            />
          </FormControl.Root>
        </View>

        <View className="flex-row gap-5">
          <Button.Root>
            <Button.Text>Criar tópico</Button.Text>
          </Button.Root>

          <Button.Root
            variant="contained"
            className="bg-red-300"
            onPress={() => router.dismiss()}
          >
            <Button.Text>Cancelar</Button.Text>
          </Button.Root>
        </View>
      </View>
    </View>
  );
}

export default Modal;
