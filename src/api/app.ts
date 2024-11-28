import axios, { AxiosError } from 'axios';
import type { ImagePickerAsset } from 'expo-image-picker';

import { token } from '@/core/auth';

import {
  Comment,
  Complaint,
  CreateComplaint,
  Forum,
  GetForumsByCity,
  User
} from './types';
import { router } from 'expo-router';
import type { CreateForumForm } from '@/app/create-forum';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

interface AuthUserDto {
  email: string;
  password: string;
}

export const baseURL = 'http://10.0.0.7:3000';

export const appApi = axios.create({
  baseURL
});

appApi.interceptors.request.use((request) => {
  if (!token) return request;

  const tokenSaved = token();

  request.headers.Authorization = `Bearer ${tokenSaved?.accessToken}`;

  return request;
});

appApi.interceptors.response.use(
  (response) => response,
  (response: AxiosError) => {
    if (response.status === 401) router.replace('/login');

    return response;
  }
);

export async function createUser(data: CreateUserDto) {
  const response = await appApi.post<CreateUserDto>('/users', data);

  return response;
}

export async function listAllUsers() {
  const response = await appApi.get('/users');

  return response;
}

export async function authUser(data: AuthUserDto) {
  const response = await appApi.post<{ accessToken: string; id: string }>(
    '/auth',
    data
  );

  return response;
}

export async function uploadComplaintImage(
  name: string,
  images: ImagePickerAsset[],
  complaintId: string
) {
  const formData = new FormData();

  images.forEach(({ uri, mimeType, fileName }) => {
    formData.append(name, {
      uri,
      name: fileName,
      type: mimeType as string
    } as unknown as string);
  });

  const response = await appApi.post(
    `/complaints/images/${complaintId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response;
}

export async function createComplaint(data: CreateComplaint) {
  const response = await appApi.post<Complaint>('/complaints', data);

  return response;
}

export async function uploadUserAvatar(name: string, image: ImagePickerAsset) {
  const formData = new FormData();

  formData.append(name, {
    uri: image.uri,
    name: image.fileName,
    type: image.mimeType as string
  } as unknown as string);

  const response = await appApi.patch(`/users/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response;
}

export async function getUserAuthenticated() {
  const response = await appApi.patch<User>('/users/authenticated');

  return response;
}

export async function getUserAvatar() {
  const response = await appApi.patch('/files/avatar', undefined, {
    responseType: 'arraybuffer'
  });

  return response;
}

export async function createForum(data: Omit<Forum, 'updatedAt'>) {
  const response = await appApi.post('/forums', data);

  return response;
}

export async function getForumsByCity(cityId: string | number) {
  const response = await appApi.get<GetForumsByCity[]>(
    `/forums/citys/${cityId}`
  );

  return response;
}

export interface Response extends Forum {
  owner: {
    name: string;
  };
}

export async function getForumById(id: string | number) {
  const response = await appApi.get<Response>(`/forums/${id}`);

  return response;
}

export async function createComment(data: {
  content: string;
  forumId: string;
}) {
  const output = await appApi.post('/forums/comments', data);

  return output;
}

export interface GetCommentsByForum extends Comment {
  owner: { name: string; id: string };
}

export async function getCommentsByForum(forumId: string) {
  const output = await appApi.get<GetCommentsByForum[]>(
    `/forums/${forumId}/comments`
  );

  return output;
}

export async function removeComment(id: number | string) {
  await appApi.delete(`/forums/comments/${id}`);
}
