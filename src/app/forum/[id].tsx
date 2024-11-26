import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import PagerView from 'react-native-pager-view';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import Text from '@/ui/text';
import TextInput from '@/ui/text-input';
import { useThemeConfig } from '@/core/hooks/use-theme-config';
import {
  Response,
  getForumById,
  createComment,
  getCommentsByForum,
  GetCommentsByForum,
  removeComment
} from '@/api/app';
import Button from '@/ui/button';
import { useAuth } from '@/core/auth';

function Forum() {
  const token = useAuth();

  const theme = useThemeConfig();

  const param = useLocalSearchParams<{ id: string }>();

  const pagerViewRef = React.useRef<PagerView>(null);

  const [content, setContent] = React.useState('');

  const [forum, setForum] = React.useState<Response>();

  const [comments, setComments] = React.useState<GetCommentsByForum[]>();

  React.useEffect(() => {
    getForumById(param.id).then(({ data }) => {
      setForum(data);
    });

    getComments();
  }, []);

  async function getComments() {
    const { data } = await getCommentsByForum(param.id);

    setComments(data);
  }

  async function handleSubmit() {
    await createComment({ content, forumId: param.id });

    await getComments();

    setContent('');
  }

  return (
    <View className="pt-10 gap-10 flex-1">
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={30}
              color={tintColor}
            />
          )
        }}
      />

      <Text variant="h2" className="px-7">
        {forum?.subject}
      </Text>

      <PagerView style={{ flex: 1 }} initialPage={0} ref={pagerViewRef}>
        <View key="1" collapsable={false} className="px-7">
          <View className="flex-row gap-10 mb-10">
            <View className="flex-row gap-2 items-center">
              <MaterialIcons
                name="person-2"
                size={20}
                color={theme.colors.primary}
              />
              <Text className="font-semibold">{forum?.owner.name}</Text>
            </View>

            <View className="flex-row gap-2 items-center">
              <MaterialIcons
                name="calendar-month"
                size={20}
                color={theme.colors.primary}
              />
              {forum?.updatedAt && (
                <Text className="font-semibold">
                  {Intl.DateTimeFormat('pt-br', { dateStyle: 'short' }).format(
                    new Date(forum?.updatedAt)
                  )}
                </Text>
              )}
            </View>
          </View>

          <View className="gap-5">
            {forum?.content
              .split('\n')
              .map((text) => (
                <Text key={Math.random().toString(36).slice(2, 9)}>{text}</Text>
              ))}
          </View>

          <TouchableOpacity
            className="flex-row items-center gap-2 self-end"
            activeOpacity={0.7}
            onPress={() => pagerViewRef.current?.setPage(1)}
          >
            <Text variant="h3">comentarios</Text>

            <MaterialCommunityIcons
              size={25}
              name="arrow-right"
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View key="2" className="px-7 mb-10">
          <View className="flex-1 mb-2 rounded-lg overflow-hidden">
            <FlatList
              keyExtractor={({ id }) => id.toString()}
              data={comments}
              contentContainerClassName="gap-4"
              renderItem={({ item }) => (
                <View className="rounded-lg p-4 gap-4 bg-black-100">
                  <View className="gap-4">
                    <Text variant="h3">{item.owner.name}</Text>
                    <Text className="!text-[#ebebf599]">
                      {Intl.DateTimeFormat('pt-br').format(
                        new Date(item.updatedAt)
                      )}
                    </Text>
                  </View>
                  <Text>{item.content}</Text>
                  {token.token?.userId === item.owner.id && (
                    <View className="bg-slate-400d max-w-fit flex-row items-center self-end gap-5">
                      <Button.Root
                        className="py-2 px-4 bg-transparent"
                        onPress={async () => {
                          await removeComment(item.id);

                          await getComments();
                        }}
                      >
                        <Button.Text className="text-blue-100">
                          Apagar
                        </Button.Text>
                      </Button.Root>

                      <Button.Root className="py-2 px-4">
                        <Button.Text>Editar</Button.Text>
                      </Button.Root>
                    </View>
                  )}
                </View>
              )}
            />
          </View>

          <TextInput
            variant="outlined-gray"
            className="h-40"
            placeholder="mensagem"
            value={content}
            onChangeText={setContent}
            onSubmitEditing={handleSubmit}
            textAlignVertical="top"
          />
        </View>
      </PagerView>
    </View>
  );
}

export default Forum;
