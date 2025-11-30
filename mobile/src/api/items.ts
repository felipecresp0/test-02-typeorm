import { apiClient } from './client';

export interface Item {
  id: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  videoUrl?: string;
  videoKey?: string;
  thumbnailKey: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  avgRating?: number;
}

export interface Comment {
  id: number;
  itemId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: { id: number; displayName: string };
}

export interface Rating {
  id: number;
  value: number;
  itemId: number;
  userId: number;
  createdAt: string;
}

export interface PaginatedItems {
  data: Item[];
  total: number;
}

export interface ItemFilters {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export const listItems = async (filters: ItemFilters = {}) => {
  const { data } = await apiClient.get<PaginatedItems>('/items', { params: filters });
  return data;
};

export const getItem = async (id: number) => {
  const { data } = await apiClient.get<Item>(`/items/${id}`);
  return data;
};

export const createItem = async (payload: Partial<Item>) => {
  const { data } = await apiClient.post<Item>('/items', payload);
  return data;
};

export const updateItem = async (id: number, payload: Partial<Item>) => {
  const { data } = await apiClient.patch<Item>(`/items/${id}`, payload);
  return data;
};

export const deleteItem = async (id: number) => apiClient.delete(`/items/${id}`);

export const addFavorite = async (itemId: number) => apiClient.post(`/favorites/${itemId}`);
export const removeFavorite = async (itemId: number) => apiClient.delete(`/favorites/${itemId}`);

export const listFavorites = async (userId: number) => {
  const { data } = await apiClient.get<Item[]>(`/users/${userId}/favorites`);
  return data;
};

export const listRatings = async (itemId: number) => {
  const { data } = await apiClient.get<Rating[]>(`/items/${itemId}/ratings`);
  return data;
};

export const upsertRating = async (itemId: number, value: number) => {
  const { data } = await apiClient.post<Rating>(`/items/${itemId}/ratings`, { value });
  return data;
};

export const deleteRating = async (itemId: number, ratingId: number) =>
  apiClient.delete(`/items/${itemId}/ratings/${ratingId}`);

export const listComments = async (itemId: number) => {
  const { data } = await apiClient.get<Comment[]>(`/items/${itemId}/comments`);
  return data;
};

export const createComment = async (itemId: number, content: string) => {
  const { data } = await apiClient.post<Comment>(`/items/${itemId}/comments`, { content });
  return data;
};

export const updateComment = async (itemId: number, commentId: number, content: string) => {
  const { data } = await apiClient.patch<Comment>(`/items/${itemId}/comments/${commentId}`, {
    content,
  });
  return data;
};

export const deleteComment = async (itemId: number, commentId: number) =>
  apiClient.delete(`/items/${itemId}/comments/${commentId}`);

export const requestPresign = async (fileName: string, type: 'thumbnail' | 'video') => {
  const { data } = await apiClient.post<{ url: string; key: string; fields?: Record<string, string> }>(
    '/uploads/presign',
    { fileName, type },
  );
  return data;
};
