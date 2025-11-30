import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Item } from '../api/items';

interface Props {
  item: Item;
  onPress: () => void;
}

const ItemCard: React.FC<Props> = ({ item, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={{
          uri: item.thumbnailKey.startsWith('http')
            ? item.thumbnailKey
            : `https://placehold.co/600x400?text=${encodeURIComponent(item.title)}`,
        }}
        style={styles.thumbnail}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.category || 'Sin categoría'}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        {item.avgRating && <Text style={styles.rating}>⭐ {item.avgRating.toFixed(1)}</Text>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  thumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#f3f4f6',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    color: '#6b7280',
  },
  price: {
    fontWeight: '700',
    marginTop: 6,
  },
  rating: {
    marginTop: 4,
    color: '#f59e0b',
  },
});

export default ItemCard;
