import { View } from 'react-native';

import Text from '@/ui/text';
import Button from '@/ui/button';
import { router, useLocalSearchParams } from 'expo-router';
import { removeComment } from '@/api/app';

function DeleteComment() {
  const { id } = useLocalSearchParams<{ id: string }>();

  async function handleDelete() {
    await removeComment(Number(id));

    router.back();
  }

  return (
    <View className="bg-black-50 p-6 rounded-lg max-w-[90%] gap-10">
      <Text variant="h2">Apagar comentário</Text>

      <Text variant="h3" className="font-normal">
        Tem certeza de que deseja excluir este comentário?
      </Text>

      <View className="flex-row gap-4 self-end">
        <Button.Root className="px-4 py-2 bg-transparent" onPress={router.back}>
          <Button.Text className="text-white">Cancelar</Button.Text>
        </Button.Root>

        <Button.Root className="px-4 py-2" onPress={handleDelete}>
          <Button.Text>Apagar</Button.Text>
        </Button.Root>
      </View>
    </View>
  );
}

export default DeleteComment;
