import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { listFavorites, Item } from '../api/items';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

const FavoritesScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    if (!user) return;
    setRefreshing(true);
    const data = await listFavorites(user.id);
    setItems(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus favoritos</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('Detail', { id: item.id })} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchFavorites} />}
        ListEmptyComponent={<Text style={styles.empty}>No has guardado favoritos</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#6b7280', marginTop: 20 },
});

export default FavoritesScreen;
