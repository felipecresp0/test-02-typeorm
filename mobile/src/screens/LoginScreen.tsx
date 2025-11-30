import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
});

type FormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(schema),
  });
  const { login } = useAuth();

  const onSubmit = async (values: FormData) => {
    await login(values);
  };

  return (
    <AuthLayout>
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido de nuevo</Text>
        <FormField name="email" label="Email" placeholder="tucorreo@demo.com" control={control} />
        <FormField
          name="password"
          label="Contraseña"
          placeholder="••••••"
          control={control}
          secureTextEntry
        />
        <Button title="Iniciar sesión" onPress={handleSubmit(onSubmit)} />
        <Text style={styles.footer} onPress={() => navigation.navigate('Register' as never)}>
          ¿Sin cuenta? Regístrate
        </Text>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  footer: {
    marginTop: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
