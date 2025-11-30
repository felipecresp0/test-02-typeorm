import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{user.displayName}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  label: { color: '#6b7280', marginTop: 8 },
  value: { fontWeight: '700' },
});

export default ProfileScreen;
