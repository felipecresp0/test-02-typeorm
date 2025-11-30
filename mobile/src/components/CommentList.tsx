import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Comment } from '../api/items';

interface Props {
  comments: Comment[];
}

const CommentList: React.FC<Props> = ({ comments }) => {
  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.author}>{item.author?.displayName ?? `User ${item.userId}`}</Text>
          <Text>{item.content}</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No hay comentarios todavía</Text>}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  author: {
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
  },
});

export default CommentList;
