import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import FormField from '../components/FormField';
import { createItem, requestPresign } from '../api/items';

const schema = z.object({
  title: z.string().min(3, { message: 'Mínimo 3 caracteres' }),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0)),
  category: z.string().optional(),
  videoUrl: z.string().url({ message: 'URL no válida' }).optional(),
});

type FormData = z.infer<typeof schema>;

const CreateItemScreen = () => {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { title: '', description: '', price: 0, category: '', videoUrl: '' },
    resolver: zodResolver(schema),
  });
  const [thumbnail, setThumbnail] = useState<string>();
  const [uploading, setUploading] = useState(false);

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnail) throw new Error('Selecciona una carátula');
    setUploading(true);
    const presign = await requestPresign('thumbnail.jpg', 'thumbnail');
    const response = await fetch(thumbnail);
    const blob = await response.blob();

    if (presign.fields) {
      const formData = new FormData();
      Object.entries(presign.fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', blob as any);
      await fetch(presign.url, {
        method: 'POST',
        body: formData,
      });
    } else {
      await fetch(presign.url, {
        method: 'PUT',
        body: blob,
      });
    }

    setUploading(false);
    return presign.key;
  };

  const onSubmit = async (values: FormData) => {
    const thumbnailKey = await uploadThumbnail();
    await createItem({ ...values, thumbnailKey });
    reset();
    setThumbnail(undefined);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear nuevo curso</Text>
      <FormField name="title" label="Título" placeholder="Clase de React" control={control} />
      <FormField
        name="description"
        label="Descripción"
        placeholder="Detalles del curso"
        control={control}
        multiline
      />
      <FormField name="price" label="Precio" placeholder="50" control={control} keyboardType="numeric" />
      <FormField name="category" label="Categoría" placeholder="Programación" control={control} />
      <FormField name="videoUrl" label="Video (YouTube)" placeholder="https://" control={control} />

      <View style={styles.thumbnailRow}>
        <Button title="Elegir carátula" onPress={pickThumbnail} />
        {thumbnail && <Image source={{ uri: thumbnail }} style={styles.thumbnail} />}
      </View>

      <Button title={uploading ? 'Subiendo...' : 'Publicar'} onPress={handleSubmit(onSubmit)} disabled={uploading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  thumbnailRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12, marginBottom: 16 },
  thumbnail: { width: 90, height: 90, borderRadius: 10 },
});

export default CreateItemScreen;
