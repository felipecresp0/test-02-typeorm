import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import CommentList from '../components/CommentList';
import RatingStars from '../components/RatingStars';
import {
  Item,
  Comment,
  Rating,
  getItem,
  listComments,
  listRatings,
  addFavorite,
  removeFavorite,
  createComment,
  upsertRating,
  listFavorites,
} from '../api/items';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';

const DetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();
  const { user } = useAuth();
  const [item, setItem] = useState<Item>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [commentText, setCommentText] = useState('');
  const [ratingValue, setRatingValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const extractYoutubeId = (url?: string) => {
    if (!url) return '';
    const regex = /(?:v=|\.be\/)([^&#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const load = async () => {
    const [itemData, commentData, ratingData, favorites] = await Promise.all([
      getItem(route.params.id),
      listComments(route.params.id),
      listRatings(route.params.id),
      user ? listFavorites(user.id) : Promise.resolve([]),
    ]);
    setItem(itemData);
    setComments(commentData);
    setRatings(ratingData);
    const myRating = ratingData.find((r) => r.userId === user?.id);
    setRatingValue(myRating?.value ?? 0);
    setIsFavorite(Boolean(favorites?.some((fav) => fav.id === itemData.id)));
  };

  useEffect(() => {
    load();
  }, [route.params.id, user?.id]);

  const handleFavorite = async () => {
    if (!item) return;
    if (isFavorite) {
      await removeFavorite(item.id);
      setIsFavorite(false);
    } else {
      await addFavorite(item.id);
      setIsFavorite(true);
    }
  };

  const handleComment = async () => {
    if (!item || !commentText.trim()) return;
    const created = await createComment(item.id, commentText.trim());
    setComments([created, ...comments]);
    setCommentText('');
  };

  const handleRating = async (value: number) => {
    if (!item) return;
    const updated = await upsertRating(item.id, value);
    const filtered = ratings.filter((r) => r.userId !== updated.userId);
    setRatings([updated, ...filtered]);
    setRatingValue(value);
  };

  if (!item) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      {item.videoUrl && (
        <View style={styles.player}>
          <YoutubePlayer height={220} play={false} videoId={extractYoutubeId(item.videoUrl)} />
        </View>
      )}
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.meta}>Categoría: {item.category || 'Sin categoría'}</Text>
      <Text style={styles.meta}>Precio: ${item.price.toFixed(2)}</Text>
      <Button title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'} onPress={handleFavorite} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu valoración</Text>
        <RatingStars value={ratingValue} onChange={handleRating} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comentarios</Text>
        <View style={styles.commentBox}>
          <TextInput
            placeholder="Escribe tu comentario"
            style={styles.commentInput}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <Button title="Publicar" onPress={handleComment} />
        </View>
        <CommentList comments={comments} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  player: { marginBottom: 12 },
  description: { marginBottom: 8 },
  meta: { color: '#374151', marginBottom: 4 },
  section: { marginTop: 16 },
  sectionTitle: { fontWeight: '700', marginBottom: 8 },
  commentBox: { backgroundColor: 'white', borderRadius: 10, padding: 10, marginBottom: 12 },
  commentInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
});

export default DetailScreen;
