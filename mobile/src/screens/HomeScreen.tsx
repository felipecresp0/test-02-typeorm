import React, { useEffect, useState } from 'react';
import { Button, FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import ItemCard from '../components/ItemCard';
import { Item, ItemFilters, listItems } from '../api/items';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<Item[]>([]);
  const [filters, setFilters] = useState<ItemFilters>({ page: 1, limit: 20 });
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async (nextFilters?: ItemFilters) => {
    setRefreshing(true);
    const response = await listItems(nextFilters ?? filters);
    setItems(response.data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const applySearch = () => {
    const next = { ...filters, q: search };
    setFilters(next);
    fetchItems(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explora cursos</Text>
      <View style={styles.filters}>
        <TextInput
          placeholder="Buscar título o categoría"
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Buscar" onPress={applySearch} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('Detail', { id: item.id })} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchItems()} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay cursos disponibles</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginBottom: 12,
  },
  search: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
});

export default HomeScreen;
